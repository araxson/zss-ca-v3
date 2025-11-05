import 'server-only'

import Stripe from 'stripe'
import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  const supabase = await createClient()

  const inv = invoice as unknown as { subscription?: string }
  if (!inv.subscription) return

  const { error, data: updatedSub } = await supabase
    .from('subscription')
    .update({
      status: 'active',
    })
    .eq('stripe_subscription_id', inv.subscription)
    .select('profile_id')
    .single()

  if (error) {
    console.error('Webhook error: Failed to update subscription after payment', {
      subscriptionId: inv.subscription,
      errorCode: error.code,
      invoiceId: invoice.id
    })
    return
  }

  // ✅ Next.js 15+: Revalidate cache after successful payment (background refresh)
  if (updatedSub) {
    revalidateTag('subscriptions', 'max')
    revalidateTag(`subscription:${updatedSub.profile_id}`, 'max')
    revalidateTag(`profile:${updatedSub.profile_id}`, 'max')
  }
}

export async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const supabase = await createClient()

  const inv = invoice as unknown as { subscription?: string }
  if (!inv.subscription) return

  const { error, data: updatedSub } = await supabase
    .from('subscription')
    .update({
      status: 'past_due',
    })
    .eq('stripe_subscription_id', inv.subscription)
    .select('profile_id')
    .single()

  if (error) {
    console.error('Webhook error: Failed to update subscription after failed payment', {
      subscriptionId: inv.subscription,
      errorCode: error.code,
      invoiceId: invoice.id
    })
    return
  }

  // ✅ Next.js 15+: Revalidate cache after failed payment (background refresh)
  if (updatedSub) {
    revalidateTag('subscriptions', 'max')
    revalidateTag(`subscription:${updatedSub.profile_id}`, 'max')
    revalidateTag(`profile:${updatedSub.profile_id}`, 'max')
  }
}
