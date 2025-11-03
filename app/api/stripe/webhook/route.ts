import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/stripe/webhooks'
import {
  handleCheckoutCompleted,
  handleSubscriptionUpdate,
  handleSubscriptionDeleted,
  handlePaymentSucceeded,
  handlePaymentFailed,
} from '@/lib/stripe/webhook-handlers'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const event = await verifyWebhookSignature(body)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const err = error as Error
    console.error('Webhook error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
