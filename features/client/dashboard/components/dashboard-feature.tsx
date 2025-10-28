import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { getClientDashboardData, DashboardOverview } from '@/features/client/dashboard'

export async function DashboardFeature() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { profile, subscription, sites, tickets, openTicketsCount } = await getClientDashboardData(user.id)

  return (
    <DashboardOverview
      profile={profile}
      subscription={subscription}
      sites={sites}
      tickets={tickets}
      openTicketsCount={openTicketsCount}
    />
  )
}
