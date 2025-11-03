import type { Database } from '@/lib/types/database.types'

export type PricingPlan = Database['public']['Tables']['plan']['Row']

export type BillingInterval = 'monthly' | 'yearly'

export interface PricingPlansProps {
  plans: PricingPlan[]
  isAuthenticated: boolean
  hasSubscription: boolean
}

export interface PricingPlansCopy {
  ctaAuthenticated: string
  ctaUnauthenticated: string
  popularLabel: string
}
