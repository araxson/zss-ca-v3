import 'server-only'

import { headers } from 'next/headers'
import { stripe } from './server'
import type Stripe from 'stripe'

/**
 * Verify and construct Stripe webhook event
 * @param body Raw request body
 * @returns Verified Stripe event
 */
export async function verifyWebhookSignature(
  body: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET']

  if (!webhookSecret) {
    throw new Error('Stripe webhook secret is not configured')
  }

  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    throw new Error('Missing stripe-signature header')
  }

  try {
    return stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const error = err as Error
    throw new Error(`Webhook signature verification failed: ${error.message}`)
  }
}
