import 'server-only'

import { stripe } from './server'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'

interface CreateCheckoutSessionParams {
  planId: string
  billingInterval: 'monthly' | 'yearly'
  origin: string
}

export async function createCheckoutSession({
  planId,
  billingInterval,
  origin,
}: CreateCheckoutSessionParams) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: plan, error: planError } = await supabase
    .from('plan')
    .select('*')
    .eq('id', planId)
    .single()

  if (planError || !plan) {
    throw new Error('Plan not found')
  }

  const priceId =
    billingInterval === 'yearly'
      ? plan.stripe_price_id_yearly
      : plan.stripe_price_id_monthly

  if (!priceId) {
    throw new Error('Price ID not configured for this plan')
  }

  const { data: existingSubscription } = await supabase
    .from('subscription')
    .select('*')
    .eq('profile_id', user.id)
    .in('status', ['active', 'trialing', 'past_due'])
    .single()

  if (existingSubscription) {
    throw new Error('User already has an active subscription')
  }

  const { data: profile } = await supabase
    .from('profile')
    .select('contact_email')
    .eq('id', user.id)
    .single()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: profile?.contact_email || user.email,
    client_reference_id: user.id,
    metadata: {
      plan_id: planId,
      profile_id: user.id,
    },
    success_url: `${origin}${ROUTES.CLIENT_DASHBOARD}?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=canceled`,
    subscription_data: {
      metadata: {
        plan_id: planId,
        profile_id: user.id,
      },
    },
  })

  return { sessionId: session.id, url: session.url }
}
