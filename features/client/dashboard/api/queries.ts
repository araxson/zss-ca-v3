import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profile']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row'] & {
  plan: Database['public']['Tables']['plan']['Row'] | null
}
type ClientSite = Database['public']['Tables']['client_site']['Row']
type SupportTicket = Database['public']['Tables']['support_ticket']['Row']

export async function getClientDashboardData(userId: string) {
  const supabase = await createClient()

  // Get profile data
  const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .eq('id', userId)
    .single()

  // Get active subscription with plan details
  const { data: subscription } = await supabase
    .from('subscription')
    .select('*, plan:plan_id(*)')
    .eq('profile_id', userId)
    .is('deleted_at', null)
    .maybeSingle()

  // Get all client sites (clients can have multiple sites)
  const { data: sites } = await supabase
    .from('client_site')
    .select('*')
    .eq('profile_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  // Get recent support tickets
  const { data: tickets } = await supabase
    .from('support_ticket')
    .select('id, subject, status, priority, created_at')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get open tickets count
  const { count: openTicketsCount } = await supabase
    .from('support_ticket')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', userId)
    .in('status', ['open', 'in_progress'])

  return {
    profile: profile as Profile | null,
    subscription: subscription as Subscription | null,
    sites: (sites || []) as ClientSite[],
    tickets: (tickets || []) as SupportTicket[],
    openTicketsCount: openTicketsCount ?? 0,
  }
}
