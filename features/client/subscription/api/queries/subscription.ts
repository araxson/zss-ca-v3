import 'server-only'

import { cache } from 'react'
import { createClient, requireAuth } from '@/lib/supabase'
import type { Database } from '@/lib/types/database.types'

type Subscription = Database['public']['Tables']['subscription']['Row']
type Plan = Database['public']['Tables']['plan']['Row']

export type SubscriptionWithPlan = Subscription & {
  plan: Plan
}

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
export const getCurrentSubscription = cache(async (
  userId: string
): Promise<SubscriptionWithPlan | null> => {
  const supabase = await createClient()
  await requireAuth(supabase)

  const { data, error } = await supabase
    .from('subscription')
    .select(`
      id,
      profile_id,
      plan_id,
      stripe_subscription_id,
      status,
      current_period_start,
      current_period_end,
      cancel_at_period_end,
      created_at,
      plan:plan_id(id, name, slug, page_limit, revision_limit, is_active)
    `)
    .eq('profile_id', userId)
    .in('status', ['active', 'trialing', 'past_due'])
    .is('deleted_at', null)
    .single()

  if (error || !data) {
    return null
  }

  return data as unknown as SubscriptionWithPlan
})

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
export const getSubscriptionHistory = cache(async (userId: string): Promise<SubscriptionWithPlan[]> => {
  const supabase = await createClient()
  await requireAuth(supabase)

  const { data, error } = await supabase
    .from('subscription')
    .select(`
      id,
      profile_id,
      plan_id,
      stripe_subscription_id,
      status,
      current_period_start,
      current_period_end,
      cancel_at_period_end,
      created_at,
      plan:plan_id(id, name, slug, page_limit, revision_limit, is_active)
    `)
    .eq('profile_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return (data as unknown as SubscriptionWithPlan[]) || []
})
