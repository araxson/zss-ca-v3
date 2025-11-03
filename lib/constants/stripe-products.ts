/**
 * Stripe Product IDs
 */

export const STRIPE_PRODUCTS = {
  essential: 'prod_TJ3wnJmnh994fm',
  growth: 'prod_TJ3wEEskj8hM4R',
  pro: 'prod_TJ3wpQuXztGOK3',
  elite: 'prod_TJ3wDlsVVABcCt',
} as const

export type StripeProduct = keyof typeof STRIPE_PRODUCTS
