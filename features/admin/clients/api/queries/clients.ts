import 'server-only'

import { createClient, requireAuth, requireAdminRole } from '@/lib/supabase'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profile']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row']
type Plan = Database['public']['Tables']['plan']['Row']

export type ClientProfile = Profile & {
  subscription: (Subscription & { plan: Plan }) | null
}

export async function listClients(): Promise<ClientProfile[]> {
  const supabase = await createClient()
  const user = await requireAuth(supabase)
  await requireAdminRole(supabase, user.id)

  const { data, error } = await supabase
    .from('profile')
    .select(
      `
      *,
      subscription:subscription!subscription_profile_fk(
        *,
        plan!subscription_plan_fk(*)
      )
    `
    )
    .eq('role', 'client')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching clients:', error)
    return []
  }

  // Transform the data to get the active subscription
  return (
    (data as unknown as (Profile & { subscription: (Subscription & { plan: Plan | null })[] })[])?.map(
      (client) => {
        const activeSubscription = client.subscription.find((sub) =>
          ['active', 'trialing', 'past_due'].includes(sub.status) && sub.plan !== null
        )
        return {
          ...client,
          subscription: activeSubscription ? (activeSubscription as Subscription & { plan: Plan }) : null,
        }
      }
    ) || []
  )
}
