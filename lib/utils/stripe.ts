import {
  STRIPE_PRICES,
  STRIPE_LOOKUP_KEYS,
  STRIPE_PRODUCTS,
  PLAN_IDS,
  PRICING,
  type PlanSlug,
  type StripePrice,
  type StripeLookupKey,
} from '@/lib/constants/stripe'

/**
 * Get price ID by plan slug and billing cycle
 */
export function getPriceId(plan: PlanSlug, cycle: 'monthly' | 'annual'): string {
  const key = `${plan}_${cycle}` as StripePrice
  return STRIPE_PRICES[key]
}

/**
 * Get lookup key by plan slug and billing cycle
 */
export function getLookupKey(plan: PlanSlug, cycle: 'monthly' | 'annual'): string {
  const key = `${plan}_${cycle}` as StripeLookupKey
  return STRIPE_LOOKUP_KEYS[key]
}

/**
 * Get product ID by plan slug
 */
export function getProductId(plan: PlanSlug): string {
  return STRIPE_PRODUCTS[plan]
}

/**
 * Get database plan ID by slug
 */
export function getDatabasePlanId(plan: PlanSlug): string {
  return PLAN_IDS[plan]
}

/**
 * Get annual savings amount in cents
 */
export function getAnnualSavings(plan: PlanSlug): number {
  const pricing = PRICING[plan]
  return pricing.monthly * 12 - pricing.annual
}

/**
 * Format price in CAD dollars
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(cents / 100)
}

/**
 * Get all plan slugs
 */
export function getAllPlanSlugs(): readonly PlanSlug[] {
  return ['essential', 'growth', 'pro', 'elite'] as const
}

/**
 * Type guard: Check if value is a valid plan slug
 */
export function isPlanSlug(value: unknown): value is PlanSlug {
  return (
    typeof value === 'string' &&
    ['essential', 'growth', 'pro', 'elite'].includes(value)
  )
}

/**
 * Type guard: Check if value is a valid Stripe price ID
 */
export function isStripePriceId(value: unknown): value is StripePrice {
  return (
    typeof value === 'string' &&
    (Object.values(STRIPE_PRICES) as string[]).includes(value)
  )
}

/**
 * Type guard: Check if value is a valid Stripe product ID
 */
export function isStripeProductId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    (Object.values(STRIPE_PRODUCTS) as string[]).includes(value)
  )
}
