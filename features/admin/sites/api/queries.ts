import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Profile = Database['public']['Tables']['profile']['Row']
type Plan = Database['public']['Tables']['plan']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row']

type SiteWithRelations = ClientSite & {
  profile: Pick<Profile, 'id' | 'contact_name' | 'contact_email' | 'company_name'>
  plan: Pick<Plan, 'id' | 'name' | 'slug'> | null
  subscription: Pick<Subscription, 'id' | 'status'> | null
}

export async function getAllSites(): Promise<SiteWithRelations[]> {
  const supabase = await createClient()

  const { data: sites } = await supabase
    .from('client_site')
    .select(`
      *,
      profile:profile_id(id, contact_name, contact_email, company_name),
      plan:plan_id(id, name, slug),
      subscription:subscription_id(id, status)
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (sites as SiteWithRelations[]) || []
}

export async function getSiteById(siteId: string): Promise<SiteWithRelations | null> {
  const supabase = await createClient()

  const { data: site } = await supabase
    .from('client_site')
    .select(`
      *,
      profile:profile_id(id, contact_name, contact_email, company_name),
      plan:plan_id(id, name, slug),
      subscription:subscription_id(id, status)
    `)
    .eq('id', siteId)
    .is('deleted_at', null)
    .single()

  return (site as SiteWithRelations) || null
}

export async function getSitesByClientId(profileId: string): Promise<ClientSite[]> {
  const supabase = await createClient()

  const { data: sites } = await supabase
    .from('client_site')
    .select('*')
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return sites || []
}
