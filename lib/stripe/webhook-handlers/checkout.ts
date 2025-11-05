import 'server-only'

import Stripe from 'stripe'
import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendSubscriptionCreatedEmail } from '@/lib/email/send'

export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const supabase = await createClient()

  if (!session.subscription || !session.customer) {
    console.error('Webhook error: Missing subscription or customer in checkout session', {
      sessionId: session.id,
      hasSubscription: !!session.subscription,
      hasCustomer: !!session.customer
    })
    return
  }

  const profileId = session.client_reference_id
  if (!profileId) {
    console.error('Webhook error: Missing client_reference_id in checkout session', {
      sessionId: session.id
    })
    return
  }

  const { error: profileError } = await supabase
    .from('profile')
    .update({ stripe_customer_id: session.customer as string })
    .eq('id', profileId)

  if (profileError) {
    console.error('Webhook error: Failed to update profile with stripe_customer_id', {
      profileId,
      error: profileError.code,
      sessionId: session.id
    })
  }

  const planId = session.metadata?.['plan_id']
  if (!planId) {
    console.error('Webhook error: Missing plan_id in checkout session metadata', {
      sessionId: session.id,
      metadata: session.metadata
    })
    return
  }

  const { error } = await supabase.from('subscription').insert({
    profile_id: profileId,
    stripe_subscription_id: session.subscription as string,
    status: 'active',
    plan_id: planId,
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
  })

  if (error) {
    console.error('Webhook error: Failed to create subscription', {
      profileId,
      planId,
      errorCode: error.code,
      sessionId: session.id
    })
    return
  }

  const { data: profile } = await supabase
    .from('profile')
    .select('contact_email, contact_name')
    .eq('id', profileId)
    .single()

  const { data: plan } = await supabase
    .from('plan')
    .select('name')
    .eq('id', planId)
    .single()

  if (profile?.contact_email && profile?.contact_name && plan?.name) {
    await sendSubscriptionCreatedEmail(
      profile.contact_email,
      profile.contact_name,
      plan.name,
      session.amount_total || 0
    )
  }

  // ✅ Next.js 15+: Revalidate cache after subscription creation (background refresh)
  // Use revalidateTag (not updateTag) because this is a webhook, not a Server Action
  revalidateTag('subscriptions', 'max')
  revalidateTag(`subscription:${profileId}`, 'max')
  revalidateTag(`profile:${profileId}`, 'max')
}
