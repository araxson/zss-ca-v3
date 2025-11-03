import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe/checkout'

export async function POST(req: NextRequest) {
  try {
    const { planId, billingInterval } = await req.json()

    if (!planId || !billingInterval) {
      return NextResponse.json(
        { error: 'Missing planId or billingInterval' },
        { status: 400 }
      )
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const result = await createCheckoutSession({
      planId,
      billingInterval,
      origin,
    })

    return NextResponse.json(result)
  } catch (error) {
    const err = error as Error
    console.error('Checkout error:', err.message)

    const statusMap: Record<string, number> = {
      Unauthorized: 401,
      'Plan not found': 404,
      'User already has an active subscription': 400,
      'Price ID not configured for this plan': 400,
    }

    const status = statusMap[err.message] || 500

    return NextResponse.json({ error: err.message }, { status })
  }
}
