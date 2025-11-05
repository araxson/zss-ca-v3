import 'server-only'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getUserTickets } from '@/features/client/support/api/queries'
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
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild>
          <Link href={ROUTES.CLIENT_SUPPORT_NEW}>
            <Plus className="mr-2 size-4" aria-hidden="true" />
            New Ticket
          </Link>
        </Button>
      </div>

      <TicketList tickets={tickets} basePath={ROUTES.CLIENT_SUPPORT} />
    </div>
  )
}
