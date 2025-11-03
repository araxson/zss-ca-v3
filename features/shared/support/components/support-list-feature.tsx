import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getUserTickets } from '@/features/shared/support/api/queries'
import { TicketList } from './ticket-list'
import { Item, ItemHeader, ItemTitle, ItemDescription, ItemActions } from '@/components/ui/item'

export async function SupportListFeature() {
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
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle className="text-3xl font-bold tracking-tight">Support Tickets</ItemTitle>
          <ItemDescription>View and manage your support requests</ItemDescription>
        </ItemHeader>
        <ItemActions>
          <Button asChild>
            <Link href="/client/support/new">
              <Plus className="mr-2 size-4" aria-hidden="true" />
              New Ticket
            </Link>
          </Button>
        </ItemActions>
      </Item>

      <TicketList tickets={tickets} basePath="/client/support" />
    </div>
  )
}
