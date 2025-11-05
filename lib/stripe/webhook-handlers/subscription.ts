import 'server-only'

import Stripe from 'stripe'
import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendSubscriptionCanceledEmail } from '@/lib/email/send'

export async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription
) {
  const supabase = await createClient()

  const sub = subscription as unknown as {
    id: string
    status: string
    current_period_start: number
    current_period_end: number
  }

  const { error, data: updatedSub } = await supabase
    .from('subscription')
    .update({
      status: sub.status as 'active' | 'past_due' | 'canceled' | 'trialing',
      current_period_start: new Date(
        sub.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        sub.current_period_end * 1000
      ).toISOString(),
    })
    .eq('stripe_subscription_id', sub.id)
    .select('profile_id')
    .single()

  if (error) {
    console.error('Webhook error: Failed to update subscription', {
      subscriptionId: sub.id,
      status: sub.status,
      errorCode: error.code
    })
    return
  }

  // ✅ Next.js 15+: Revalidate cache after subscription update (background refresh)
  if (updatedSub) {
    revalidateTag('subscriptions', 'max')
    revalidateTag(`subscription:${updatedSub.profile_id}`, 'max')
    revalidateTag(`profile:${updatedSub.profile_id}`, 'max')
  }
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const supabase = await createClient()

  const { error, data: sub } = await supabase
    .from('subscription')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
    .select('profile_id, plan_id')
    .single()

  if (error) {
    console.error('Webhook error: Failed to cancel subscription', {
      subscriptionId: subscription.id,
      errorCode: error.code
    })
    return
  }

  if (sub) {
    const { data: profile } = await supabase
      .from('profile')
      .select('contact_email, contact_name')
      .eq('id', sub.profile_id)
      .single()

    const { data: plan } = await supabase
      .from('plan')
      .select('name')
      .eq('id', sub.plan_id)
      .single()

    if (profile?.contact_email && profile?.contact_name && plan?.name) {
      await sendSubscriptionCanceledEmail(
        profile.contact_email,
        profile.contact_name,
        plan.name
      )
    }

    // ✅ Next.js 15+: Revalidate cache after subscription deletion (background refresh)
    revalidateTag('subscriptions', 'max')
    revalidateTag(`subscription:${sub.profile_id}`, 'max')
    revalidateTag(`profile:${sub.profile_id}`, 'max')
  }
}
