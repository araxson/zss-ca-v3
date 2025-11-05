import 'server-only'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Plan = Database['public']['Tables']['plan']['Row']

type SiteWithPlan = ClientSite & {
  plan: Pick<Plan, 'id' | 'name' | 'slug' | 'page_limit' | 'revision_limit'> | null
}

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
// Page uses dynamic = 'force-dynamic' for real-time user data
export const getClientSites = cache(async (): Promise<SiteWithPlan[]> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

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
      slug,
      plan:plan_id(id, name, slug, page_limit, revision_limit)
    `)
    .eq('profile_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (sites as SiteWithPlan[]) || []
})

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
// Parameterized cache for individual site details
export const getClientSiteById = cache(async (siteId: string): Promise<SiteWithPlan | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

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
      plan:plan_id(id, name, slug, page_limit, revision_limit)
    `)
    .eq('id', siteId)
    .eq('profile_id', user.id)
    .is('deleted_at', null)
    .single()

  return (site as SiteWithPlan) || null
})
