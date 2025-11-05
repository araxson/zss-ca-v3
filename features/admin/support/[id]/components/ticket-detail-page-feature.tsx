import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getTicketById, getAdminTicketProfile } from '../api/queries'
import { TicketDetail } from '@/features/admin/support/components/ticket-detail'

interface TicketDetailPageFeatureProps {
  id: string
}

export async function TicketDetailPageFeature({ id }: TicketDetailPageFeatureProps): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const profile = await getAdminTicketProfile(user.id)
  if (profile?.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  const ticket = await getTicketById(id)
  if (!ticket) redirect(ROUTES.ADMIN_SUPPORT)

  return <TicketDetail ticket={ticket} currentUserId={user.id} isAdmin={true} />
}
