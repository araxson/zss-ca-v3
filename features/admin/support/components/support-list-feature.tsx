import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getUserTickets } from '@/features/admin/support/api/queries'
import { TicketList } from './ticket-list'

export async function SupportListFeature(): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  const tickets = await getUserTickets(user.id)

  return (
    <TicketList tickets={tickets} basePath="/admin/support" />
  )
}
