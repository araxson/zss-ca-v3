import 'server-only'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { ROUTES } from '@/lib/constants/routes'

type Profile = Database['public']['Tables']['profile']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row'] & {
  plan: Database['public']['Tables']['plan']['Row'] | null
}
type ClientSite = Database['public']['Tables']['client_site']['Row']
type SupportTicket = Database['public']['Tables']['support_ticket']['Row']

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
// Parameterized cache for user-specific dashboard data
// Page uses dynamic = 'force-dynamic' for real-time user data
export const getClientDashboardData = cache(async (userId: string) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // ✅ Use redirect instead of throw for auth failures
  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  // Fetch all data in parallel to avoid waterfall
  const [
    { data: profile },
    { data: subscription },
    { data: sites },
    { data: tickets },
    { count: openTicketsCount },
  ] = await Promise.all([
    // Get profile data
    supabase
      .from('profile')
      .select('id, contact_name, contact_email, contact_phone, company_name, stripe_customer_id, created_at')
      .eq('id', userId)
      .single(),

    // Get active subscription with plan details
    supabase
      .from('subscription')
      .select(`
        id,
        profile_id,
        plan_id,
        stripe_subscription_id,
        status,
        current_period_start,
        current_period_end,
        cancel_at_period_end,
        created_at,
        plan:plan_id(id, name, slug, page_limit, revision_limit)
      `)
      .eq('profile_id', userId)
      .is('deleted_at', null)
      .maybeSingle(),

    // Get all client sites (clients can have multiple sites)
    supabase
      .from('client_site')
      .select('id, profile_id, site_name, deployment_url, custom_domain, plan_id, subscription_id, status, created_at, deployed_at, slug')
      .eq('profile_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false }),

    // Get recent support tickets
    supabase
      .from('support_ticket')
      .select('id, subject, status, priority, created_at')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),

    // Get open tickets count
    supabase
      .from('support_ticket')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', userId)
      .in('status', ['open', 'in_progress']),
  ])

  return {
    profile: profile as Profile | null,
    subscription: subscription as Subscription | null,
    sites: (sites || []) as ClientSite[],
    tickets: (tickets || []) as SupportTicket[],
    openTicketsCount: openTicketsCount ?? 0,
  }
})
