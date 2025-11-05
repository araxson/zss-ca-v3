import 'server-only'

import { cache } from 'react'
import { createClient, requireAuth, requireAdminRole } from '@/lib/supabase'
import type { Database } from '@/lib/types/database.types'

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Profile = Database['public']['Tables']['profile']['Row']
type Plan = Database['public']['Tables']['plan']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row']

export type SiteWithRelations = ClientSite & {
  profile: Pick<Profile, 'id' | 'contact_name' | 'contact_email' | 'company_name'>
  plan: Pick<Plan, 'id' | 'name' | 'slug'> | null
  subscription: Pick<Subscription, 'id' | 'status'> | null
}

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
// Page uses dynamic = 'force-dynamic' for real-time admin data
export const listSites = cache(async (): Promise<SiteWithRelations[]> => {
  const supabase = await createClient()
  const user = await requireAuth(supabase)
  await requireAdminRole(supabase, user.id)

  const { data: sites } = await supabase
    .from('client_site')
    .select(`
      id,
      profile_id,
      site_name,
      deployment_url,
      custom_domain,
      plan_id,
      subscription_id,
      status,
      created_at,
      updated_at,
      deployed_at,
      deployment_notes,
      design_brief,
      slug,
      last_revision_at,
      deleted_at,
      profile:profile_id(id, contact_name, contact_email, company_name),
      plan:plan_id(id, name, slug),
      subscription:subscription_id(id, status)
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (sites as SiteWithRelations[]) || []
})

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
// Parameterized cache for client-specific sites
export const getSitesByClientId = cache(async (profileId: string): Promise<ClientSite[]> => {
  const supabase = await createClient()
  const user = await requireAuth(supabase)
  await requireAdminRole(supabase, user.id)

  const { data: sites } = await supabase
    .from('client_site')
    .select(`
      id,
      profile_id,
      site_name,
      deployment_url,
      custom_domain,
      plan_id,
      subscription_id,
      status,
      design_brief,
      created_at,
      updated_at,
      deployed_at,
      deployment_notes,
      slug,
      last_revision_at,
      deleted_at
    `)
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return sites || []
})
