import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Subscription = Database['public']['Tables']['subscription']['Row']
type Plan = Database['public']['Tables']['plan']['Row']

export type SubscriptionWithPlan = Subscription & {
  plan: Plan
}

export async function getCurrentSubscription(
  userId: string
): Promise<SubscriptionWithPlan | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subscription')
    .select('*, plan:plan_id(*)')
    .eq('profile_id', userId)
    .in('status', ['active', 'trialing', 'past_due'])
    .is('deleted_at', null)
    .single()

  if (error || !data) {
    return null
  }

  return data as unknown as SubscriptionWithPlan
}

export async function getSubscriptionHistory(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subscription')
    .select('*, plan:plan_id(*)')
    .eq('profile_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return (data as unknown as SubscriptionWithPlan[]) || []
}
