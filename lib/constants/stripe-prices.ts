/**
 * Stripe Price IDs and Lookup Keys
 */

export const STRIPE_PRICES = {
  essential_monthly: 'price_1SMRoVP9fFsmlAaF9zkoG6QT',
  essential_annual: 'price_1SMRoVP9fFsmlAaFUMgWLMJO',
  growth_monthly: 'price_1SMRoWP9fFsmlAaFnRp0Qap8',
  growth_annual: 'price_1SMRoWP9fFsmlAaF4V7jpxQI',
  pro_monthly: 'price_1SMRoXP9fFsmlAaFSKYWVyRK',
  pro_annual: 'price_1SMRoXP9fFsmlAaFrwN3YGUF',
  elite_monthly: 'price_1SMRoYP9fFsmlAaFHmXwXCth',
  elite_annual: 'price_1SMRoYP9fFsmlAaFt182MXUM',
} as const

export type StripePrice = keyof typeof STRIPE_PRICES

/**
 * Use lookup keys instead of hard-coded price IDs for easier price updates.
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
} as const

export type StripeLookupKey = keyof typeof STRIPE_LOOKUP_KEYS
