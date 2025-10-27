import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, billingInterval } = await req.json()

    if (!planId || !billingInterval) {
      return NextResponse.json(
        { error: 'Missing planId or billingInterval' },
        { status: 400 }
      )
    }

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('plan')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Get the appropriate price ID
    const priceId =
      billingInterval === 'yearly'
        ? plan.stripe_price_id_yearly
        : plan.stripe_price_id_monthly

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this plan' },
        { status: 400 }
      )
    }

    // Check if user already has a subscription
    const { data: existingSubscription } = await supabase
      .from('subscription')
      .select('*')
      .eq('profile_id', user.id)
      .in('status', ['active', 'trialing', 'past_due'])
      .single()

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'User already has an active subscription' },
        { status: 400 }
      )
    }

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profile')
      .select('contact_email')
      .eq('id', user.id)
      .single()

    const origin = req.headers.get('origin') || 'http://localhost:3000'

    // Create Stripe checkout session
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

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    const err = error as Error
    console.error('Checkout error:', err.message)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
