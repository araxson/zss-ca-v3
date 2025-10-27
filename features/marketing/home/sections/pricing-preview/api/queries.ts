import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Plan = Database['public']['Tables']['plan']['Row']

export interface PlanWithPricing extends Plan {
  priceMonthly?: number
  priceYearly?: number
}

export async function getPlansForPreview(): Promise<PlanWithPricing[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('plan')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .limit(3) // Only show top 3 plans on home page

  if (error) {
    console.error('Error fetching plans:', error)
    return []
  }

  // For now, return plans with pricing from setup_fee_cents as placeholder
  // TODO: Integrate Stripe price fetching when Stripe prices are properly configured
  return (
    data?.map((plan) => ({
      ...plan,
      priceMonthly: plan.setup_fee_cents ? plan.setup_fee_cents / 100 : undefined,
      priceYearly: plan.setup_fee_cents
        ? (plan.setup_fee_cents / 100) * 12
        : undefined,
    })) ?? []
  )
}
