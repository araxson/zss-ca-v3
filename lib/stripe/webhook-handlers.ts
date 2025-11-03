import 'server-only'

import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import {
  sendSubscriptionCreatedEmail,
  sendSubscriptionCanceledEmail,
} from '@/lib/email/send'

export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
) {
  const supabase = await createClient()

  if (!session.subscription || !session.customer) {
    throw new Error('Missing subscription or customer in checkout session')
  }

  const profileId = session.client_reference_id
  if (!profileId) {
    throw new Error('Missing client_reference_id in checkout session')
  }

  await supabase
    .from('profile')
    .update({ stripe_customer_id: session.customer as string })
    .eq('id', profileId)

  const planId = session.metadata?.plan_id
  if (!planId) {
    throw new Error('Missing plan_id in checkout session metadata')
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
    console.error('Error creating subscription:', error)
    throw error
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
}

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

  const { error } = await supabase
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

  if (error) {
    console.error('Error updating subscription:', error)
    throw error
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
    console.error('Error canceling subscription:', error)
    throw error
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
  }
}

export async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const supabase = await createClient()

  const inv = invoice as unknown as { subscription?: string }
  if (!inv.subscription) return

  const { error } = await supabase
    .from('subscription')
    .update({
      status: 'active',
    })
    .eq('stripe_subscription_id', inv.subscription)

  if (error) {
    console.error('Error updating subscription after payment:', error)
    throw error
  }
}

export async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const supabase = await createClient()

  const inv = invoice as unknown as { subscription?: string }
  if (!inv.subscription) return

  const { error } = await supabase
    .from('subscription')
    .update({
      status: 'past_due',
    })
    .eq('stripe_subscription_id', inv.subscription)

  if (error) {
    console.error('Error updating subscription after failed payment:', error)
    throw error
  }
}
