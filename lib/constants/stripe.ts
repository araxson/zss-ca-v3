/**
 * Stripe Configuration Constants
 *
 * Central source of truth for all Stripe-related IDs and configuration.
 * Maps to products/prices created with best practices (metadata, lookup keys, tax codes).
 *
 * IMPORTANT: These IDs are from your LIVE Stripe account.
 * Use lookup keys in production code for easier price updates.
 */

// ============================================================================
// STRIPE PRODUCTS
// ============================================================================

export const STRIPE_PRODUCTS = {
  essential: 'prod_TJ3wnJmnh994fm',
  growth: 'prod_TJ3wEEskj8hM4R',
  pro: 'prod_TJ3wpQuXztGOK3',
  elite: 'prod_TJ3wDlsVVABcCt',
} as const;

export type StripeProduct = keyof typeof STRIPE_PRODUCTS;

// ============================================================================
// STRIPE PRICES (Direct IDs)
// ============================================================================

export const STRIPE_PRICES = {
  essential_monthly: 'price_1SMRoVP9fFsmlAaF9zkoG6QT',
  essential_annual: 'price_1SMRoVP9fFsmlAaFUMgWLMJO',
  growth_monthly: 'price_1SMRoWP9fFsmlAaFnRp0Qap8',
  growth_annual: 'price_1SMRoWP9fFsmlAaF4V7jpxQI',
  pro_monthly: 'price_1SMRoXP9fFsmlAaFSKYWVyRK',
  pro_annual: 'price_1SMRoXP9fFsmlAaFrwN3YGUF',
  elite_monthly: 'price_1SMRoYP9fFsmlAaFHmXwXCth',
  elite_annual: 'price_1SMRoYP9fFsmlAaFt182MXUM',
} as const;

export type StripePrice = keyof typeof STRIPE_PRICES;

// ============================================================================
// STRIPE LOOKUP KEYS (Recommended for Production)
// ============================================================================

/**
 * Use lookup keys instead of hard-coded price IDs for easier price updates.
 *
 * Example:
 * ```typescript
 * const prices = await stripe.prices.list({
 *   lookup_keys: [STRIPE_LOOKUP_KEYS.essential_monthly]
 * });
 * ```
 */
export const STRIPE_LOOKUP_KEYS = {
  essential_monthly: 'essential_monthly',
  essential_annual: 'essential_annual',
  growth_monthly: 'growth_monthly',
  growth_annual: 'growth_annual',
  pro_monthly: 'pro_monthly',
  pro_annual: 'pro_annual',
  elite_monthly: 'elite_monthly',
  elite_annual: 'elite_annual',
} as const;

export type StripeLookupKey = keyof typeof STRIPE_LOOKUP_KEYS;

// ============================================================================
// SUPABASE PLAN IDs
// ============================================================================

/**
 * Database plan UUIDs - map to Stripe products.
 * These are stable UUIDs from your plan table.
 */
export const PLAN_IDS = {
  essential: 'cbb83be0-730b-4387-a77d-78c2ec986179',
  growth: '37fe5159-58ae-4ca0-be54-f9f3441c5ab7',
  pro: '9ca6174b-da03-41ef-b9a6-83c737927c9f',
  elite: 'e9acb70a-f0d3-44ee-92eb-3f6f50c0bcca',
} as const;

export type PlanId = keyof typeof PLAN_IDS;

// ============================================================================
// PLAN SLUGS (URL-friendly identifiers)
// ============================================================================

export const PLAN_SLUGS = {
  essential: 'essential',
  growth: 'growth',
  pro: 'pro',
  elite: 'elite',
} as const;

export type PlanSlug = typeof PLAN_SLUGS[keyof typeof PLAN_SLUGS];

// ============================================================================
// PRICING INFORMATION (in CAD cents)
// ============================================================================

export const PRICING = {
  essential: {
    monthly: 9700, // $97.00 CAD
    annual: 97000, // $970.00 CAD (save $194/year)
  },
  growth: {
    monthly: 19700, // $197.00 CAD
    annual: 197000, // $1,970.00 CAD (save $394/year)
  },
  pro: {
    monthly: 39700, // $397.00 CAD
    annual: 397000, // $3,970.00 CAD (save $794/year)
  },
  elite: {
    monthly: 79700, // $797.00 CAD
    annual: 797000, // $7,970.00 CAD (save $1,594/year)
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get price ID by plan slug and billing cycle
 */
export function getPriceId(plan: PlanSlug, cycle: 'monthly' | 'annual'): string {
  const key = `${plan}_${cycle}` as StripePrice;
  return STRIPE_PRICES[key];
}

/**
 * Get lookup key by plan slug and billing cycle
 */
export function getLookupKey(plan: PlanSlug, cycle: 'monthly' | 'annual'): string {
  const key = `${plan}_${cycle}` as StripeLookupKey;
  return STRIPE_LOOKUP_KEYS[key];
}

/**
 * Get product ID by plan slug
 */
export function getProductId(plan: PlanSlug): string {
  return STRIPE_PRODUCTS[plan];
}

/**
 * Get database plan ID by slug
 */
export function getDatabasePlanId(plan: PlanSlug): string {
  return PLAN_IDS[plan];
}

/**
 * Get annual savings amount in cents
 */
export function getAnnualSavings(plan: PlanSlug): number {
  const pricing = PRICING[plan];
  return (pricing.monthly * 12) - pricing.annual;
}

/**
 * Format price in CAD dollars
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(cents / 100);
}

/**
 * Get all plan slugs
 */
export function getAllPlanSlugs(): readonly PlanSlug[] {
  return Object.values(PLAN_SLUGS);
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isPlanSlug(value: unknown): value is PlanSlug {
  return typeof value === 'string' && value in PLAN_SLUGS;
}

export function isStripePriceId(value: unknown): value is StripePrice {
  return typeof value === 'string' && (Object.values(STRIPE_PRICES) as string[]).includes(value);
}

export function isStripeProductId(value: unknown): value is StripeProduct {
  return typeof value === 'string' && (Object.values(STRIPE_PRODUCTS) as string[]).includes(value);
}
