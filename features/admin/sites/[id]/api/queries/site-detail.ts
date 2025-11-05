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
export const getSiteById = cache(async (siteId: string): Promise<SiteWithRelations | null> => {
  const supabase = await createClient()
  const user = await requireAuth(supabase)
  await requireAdminRole(supabase, user.id)

  const { data: site } = await supabase
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
      profile:profile_id(id, contact_name, contact_email, company_name),
      plan:plan_id(id, name, slug),
      subscription:subscription_id(id, status)
    `)
    .eq('id', siteId)
    .is('deleted_at', null)
    .single()

  return (site as SiteWithRelations) || null
})
