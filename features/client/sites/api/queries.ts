import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Plan = Database['public']['Tables']['plan']['Row']

type SiteWithPlan = ClientSite & {
  plan: Pick<Plan, 'id' | 'name' | 'slug' | 'page_limit' | 'revision_limit'> | null
}

export async function getClientSites(): Promise<SiteWithPlan[]> {
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
      *,
      plan:plan_id(id, name, slug, page_limit, revision_limit)
    `)
    .eq('profile_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (sites as SiteWithPlan[]) || []
}

export async function getClientSiteById(siteId: string): Promise<SiteWithPlan | null> {
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
      *,
      plan:plan_id(id, name, slug, page_limit, revision_limit)
    `)
    .eq('id', siteId)
    .eq('profile_id', user.id)
    .is('deleted_at', null)
    .single()

  return (site as SiteWithPlan) || null
}
