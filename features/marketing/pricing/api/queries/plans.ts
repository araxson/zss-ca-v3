import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Plan = Database['public']['Tables']['plan']['Row']

export interface PlanWithPricing extends Plan {
  priceMonthly?: number
  priceYearly?: number
}

export async function getActivePlans(): Promise<Plan[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('plan')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    console.error('Error fetching plans:', error)
    return []
  }

  return data ?? []
}

export async function getPlansForPreview(): Promise<PlanWithPricing[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('plan')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .limit(3)

  if (error) {
    console.error('Error fetching plans:', error)
    return []
  }

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
