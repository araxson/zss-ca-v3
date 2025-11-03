/**
 * Plan IDs and Pricing
 */

export const PLAN_IDS = {
  essential: 'cbb83be0-730b-4387-a77d-78c2ec986179',
  growth: '37fe5159-58ae-4ca0-be54-f9f3441c5ab7',
  pro: '9ca6174b-da03-41ef-b9a6-83c737927c9f',
  elite: 'e9acb70a-f0d3-44ee-92eb-3f6f50c0bcca',
} as const

export type PlanId = keyof typeof PLAN_IDS

export const PLAN_SLUGS = {
  essential: 'essential',
  growth: 'growth',
  pro: 'pro',
  elite: 'elite',
} as const

export type PlanSlug = typeof PLAN_SLUGS[keyof typeof PLAN_SLUGS]

/**
 * Pricing in CAD cents
 */
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
} as const
