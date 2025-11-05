'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { createCheckoutSessionSchema, cancelSubscriptionSchema } from '../schema'

export async function createCheckoutSessionAction(
  data: unknown
): Promise<{ error: string; fieldErrors?: Record<string, string[]> } | { error: null; data: { sessionId: string; url: string } }> {
  // 1. Validate input with Zod
  const result = createCheckoutSessionSchema.safeParse(data)

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  // 2. Create authenticated Supabase client
  const supabase = await createClient()

  // 3. Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // 4. Call checkout API
  try {
    const response = await fetch(`${process.env['NEXT_PUBLIC_SITE_URL'] || 'http://localhost:3000'}/api/stripe/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.data),
      cache: 'no-store',
    })

    const apiResult = await response.json()

    if (!response.ok) {
      return { error: apiResult.error || 'Failed to create checkout session' }
    }

    return { error: null, data: { sessionId: apiResult.sessionId, url: apiResult.url } }
  } catch (error) {
    console.error('Checkout session error:', error)
    return { error: 'Failed to create checkout session' }
  }
}

export async function cancelSubscriptionAction(data: unknown) {
  // 1. Validate input with Zod
  const result = cancelSubscriptionSchema.safeParse(data)

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  // 2. Create authenticated Supabase client
  const supabase = await createClient()

  // 3. Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // 4. Verify subscription ownership
  try {
    const { data: subscription, error: subError } = await supabase
      .from('subscription')
      .select('id, profile_id, stripe_subscription_id, status')
      .eq('id', result.data.subscriptionId)
      .eq('profile_id', user.id)
      .single()

    if (subError || !subscription) {
      return { error: 'Subscription not found' }
    }

    if (!subscription.stripe_subscription_id) {
      return { error: 'Stripe subscription ID not found' }
    }

    // 5. Perform cancellation in Stripe
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id)

    // 6. Update database
    const { error: updateError } = await supabase
      .from('subscription')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      })
      .eq('id', result.data.subscriptionId)

    if (updateError) {
      console.error('Subscription update error:', updateError)
      return { error: 'Failed to update subscription' }
    }

    // 7. Invalidate cache with updateTag for immediate consistency
    updateTag('subscriptions')
    updateTag(`subscription:${result.data.subscriptionId}`)
    updateTag(`subscription:${user.id}`)

    revalidatePath(ROUTES.CLIENT_DASHBOARD, 'page')
    revalidatePath('/client/subscription', 'page')

    return { error: null }
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return { error: 'Failed to cancel subscription' }
  }
}

export async function createBillingPortalSessionAction(): Promise<{ error: string } | { error: null; data: { url: string } }> {
  // 1. Create authenticated Supabase client
  const supabase = await createClient()

  // 2. Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // 3. Get user profile with Stripe customer ID
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.stripe_customer_id) {
      return { error: 'No Stripe customer found' }
    }

    // 4. Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env['NEXT_PUBLIC_SITE_URL'] || 'http://localhost:3000'}${ROUTES.CLIENT_DASHBOARD}`,
    })

    return { error: null, data: { url: session.url } }
  } catch (error) {
    console.error('Billing portal error:', error)
    return { error: 'Failed to create billing portal session' }
  }
}
