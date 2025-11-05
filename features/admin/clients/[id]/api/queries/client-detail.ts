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
export const getClientById = cache(async (clientId: string): Promise<ClientProfile | null> => {
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
      address_line1,
      address_line2,
      city,
      province,
      postal_code,
      country,
      stripe_customer_id,
      role,
      created_at,
      updated_at,
      subscription:subscription!subscription_profile_fk(
        id,
        profile_id,
        plan_id,
        stripe_subscription_id,
        status,
        current_period_start,
        current_period_end,
        cancel_at_period_end,
        created_at,
        plan!subscription_plan_fk(id, name, slug, page_limit, revision_limit)
      )
    `
    )
    .eq('id', clientId)
    .eq('role', 'client')
    .is('deleted_at', null)
    .single()

  if (error || !data) {
    console.error('Error fetching client:', error)
    return null
  }

  // Get the active subscription
  const clientWithSubscriptions = data as unknown as Profile & {
    subscription: (Subscription & { plan: Plan | null })[]
  }

  const activeSubscription = clientWithSubscriptions.subscription.find((sub) =>
    ['active', 'trialing', 'past_due'].includes(sub.status) && sub.plan !== null
  )

  return {
    ...clientWithSubscriptions,
    subscription: activeSubscription ? (activeSubscription as Subscription & { plan: Plan }) : null,
  }
})
