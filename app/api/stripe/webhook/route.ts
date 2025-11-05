import { NextRequest, NextResponse } from 'next/server'
import {
  verifyWebhookSignature,
  handleCheckoutCompleted,
  handleSubscriptionUpdate,
  handleSubscriptionDeleted,
  handlePaymentSucceeded,
  handlePaymentFailed,
} from '@/lib/stripe'
import Stripe from 'stripe'

// ✅ Next.js 15+: Route handlers are not cached by default
// Explicitly set dynamic for clarity on POST endpoints (webhooks must never cache)
export const dynamic = 'force-dynamic'

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
  } catch (error: unknown) {
    // Type guard for Error instances
    if (error instanceof Error) {
      console.error('Webhook error:', error.message, error.stack)
    } else {
      console.error('Webhook error:', String(error))
    }
    // Don't expose internal error details to Stripe
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 })
  }
}
