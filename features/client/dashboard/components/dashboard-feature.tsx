import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClientDashboardData } from '@/features/client/dashboard/api/queries'
import { DashboardOverview } from './dashboard-overview'
import { ROUTES } from '@/lib/constants/routes'

export async function DashboardFeature(): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // ✅ Use redirect instead of returning null for auth failures
  if (!user) {
    redirect(ROUTES.LOGIN)
  }

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
