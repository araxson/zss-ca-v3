import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getUserTickets } from '@/features/shared/support/api/queries'
import { TicketList } from '@/features/shared/support/components/ticket-list'

export default async function SupportPage() {
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">View and manage your support requests</p>
        </div>
        <Button asChild>
          <Link href="/client/support/new">
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Link>
        </Button>
      </div>

      <TicketList tickets={tickets} basePath="/client/support" />
    </div>
  )
}
