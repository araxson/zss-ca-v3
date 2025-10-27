'use server'

import { revalidatePath } from 'next/cache'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import type { CreateCheckoutSessionInput, CancelSubscriptionInput } from '../schema'

export async function createCheckoutSessionAction(data: CreateCheckoutSessionInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/stripe/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to create checkout session' }
    }

    return { success: true, sessionId: result.sessionId, url: result.url }
  } catch (error) {
    const err = error as Error
    return { error: err.message }
  }
}

export async function cancelSubscriptionAction(data: CancelSubscriptionInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    // Get subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscription')
      .select('*')
      .eq('id', data.subscriptionId)
      .eq('profile_id', user.id)
      .single()

    if (subError || !subscription) {
      return { error: 'Subscription not found' }
    }

    if (!subscription.stripe_subscription_id) {
      return { error: 'Stripe subscription ID not found' }
    }

    // Cancel in Stripe
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id)

    // Update in database (webhook will also update, but this is faster)
    const { error: updateError } = await supabase
      .from('subscription')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      })
      .eq('id', data.subscriptionId)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath(ROUTES.CLIENT_DASHBOARD, 'page')
    revalidatePath('/client/subscription', 'page')

    return { success: true }
  } catch (error) {
    const err = error as Error
    return { error: err.message }
  }
}

export async function createBillingPortalSessionAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    // Get user profile with Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.stripe_customer_id) {
      return { error: 'No Stripe customer found' }
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${ROUTES.CLIENT_DASHBOARD}`,
    })

    return { success: true, url: session.url }
  } catch (error) {
    const err = error as Error
    return { error: err.message }
  }
}
