import 'server-only'

import { cache } from 'react'
import { createClient, requireAuth, requireAdminRole } from '@/lib/supabase'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profile']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row']
type Plan = Database['public']['Tables']['plan']['Row']

export type ClientProfile = Profile & {
  subscription: (Subscription & { plan: Plan }) | null
}

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
// Page uses dynamic = 'force-dynamic' for real-time admin data
export const listClients = cache(async (): Promise<ClientProfile[]> => {
  const supabase = await createClient()
  const user = await requireAuth(supabase)
  await requireAdminRole(supabase, user.id)

  const { data, error } = await supabase
    .from('profile')
    .select(
      `
      id,
      contact_name,
      contact_email,
      contact_phone,
      company_name,
      stripe_customer_id,
      role,
      created_at,
      subscription:subscription!subscription_profile_fk(
        id,
        status,
        current_period_start,
        current_period_end,
        plan!subscription_plan_fk(id, name, slug)
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
})
