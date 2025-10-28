import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getTicketById, TicketDetail } from '@/features/shared/support'

interface AdminTicketDetailFeatureProps {
  id: string
}

export async function AdminTicketDetailFeature({ id }: AdminTicketDetailFeatureProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase.from('profile').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  const ticket = await getTicketById(id)
  if (!ticket) redirect(ROUTES.ADMIN_SUPPORT)

  return <TicketDetail ticket={ticket} currentUserId={user.id} isAdmin={true} />
}
