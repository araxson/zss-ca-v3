import 'server-only'

import { createClient } from '@/lib/supabase/server'

export async function getAdminDashboardStats() {
  const supabase = await createClient()

  // Get total clients count
  const { count: totalClients } = await supabase
    .from('profile')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')
    .is('deleted_at', null)

  // Get active subscriptions count
  const { count: activeSubscriptions } = await supabase
    .from('subscription')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .is('deleted_at', null)

  // Get live sites count
  const { count: liveSites } = await supabase
    .from('client_site')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'live')
    .is('deleted_at', null)

  // Get open tickets count
  const { count: openTickets } = await supabase
    .from('support_ticket')
    .select('*', { count: 'exact', head: true })
    .in('status', ['open', 'in_progress'])

  // Get recent clients
  const { data: recentClients } = await supabase
    .from('profile')
    .select('id, contact_name, contact_email, company_name, created_at')
    .eq('role', 'client')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get recent tickets with profile info
  const { data: ticketsData } = await supabase
    .from('support_ticket')
    .select('id, subject, status, priority, created_at, profile_id')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get profile info separately for tickets
  const recentTickets = await Promise.all(
    (ticketsData || []).map(async (ticket) => {
      const { data: profile } = await supabase
        .from('profile')
        .select('contact_name, company_name')
        .eq('id', ticket.profile_id)
        .single()

      return {
        ...ticket,
        profile,
      }
    })
  )

  // Get subscription breakdown by plan
  const { data: subscriptionsByPlan } = await supabase
    .from('subscription')
    .select('plan_id, plan:plan_id(name)')
    .eq('status', 'active')
    .is('deleted_at', null)

  // Get sites by status
  const { data: sitesByStatus } = await supabase
    .from('client_site')
    .select('status')
    .is('deleted_at', null)

  // Calculate plan distribution
  const planDistribution = subscriptionsByPlan?.reduce((acc, sub) => {
    const planName = sub.plan?.name ?? 'Unknown'
    acc[planName] = (acc[planName] ?? 0) + 1
    return acc
  }, {} as Record<string, number>) ?? {}

  // Calculate site status distribution
  const statusDistribution = sitesByStatus?.reduce((acc, site) => {
    acc[site.status] = (acc[site.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>) ?? {}

  return {
    totalClients: totalClients ?? 0,
    activeSubscriptions: activeSubscriptions ?? 0,
    liveSites: liveSites ?? 0,
    openTickets: openTickets ?? 0,
    recentClients: recentClients ?? [],
    recentTickets: recentTickets ?? [],
    planDistribution,
    statusDistribution,
  }
}
