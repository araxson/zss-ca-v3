import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

/**
 * Stripe client-side instance
 * Use this in Client Components only
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    if (!key) {
      console.warn('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set; returning null Stripe client')
      stripePromise = Promise.resolve(null)
      return stripePromise
    }

    stripePromise = loadStripe(key)
  }

  return stripePromise
}
