import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getUserTickets } from '@/features/shared/support/api/queries'
import { TicketList } from '@/features/shared/support'
import { SectionHeader } from '@/features/shared/components'

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
      <SectionHeader
        title="Support Tickets"
        description="View and manage your support requests"
        align="start"
        actions={
          <Button asChild>
            <Link href="/client/support/new">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              New Ticket
            </Link>
          </Button>
        }
      />

      <TicketList tickets={tickets} basePath="/client/support" />
    </div>
  )
}
