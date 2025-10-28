import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getTicketById } from '@/features/shared/support/api/queries'
import { TicketDetail } from '@/features/shared/support'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { SectionHeader } from '@/features/shared/components'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TicketDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  const ticket = await getTicketById(id)

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyTitle>Ticket Not Found</EmptyTitle>
            <EmptyDescription>
              The ticket may not exist or you might not have access.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Alert>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                The ticket you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
              </AlertDescription>
            </Alert>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  // Verify user owns this ticket
  if (ticket.profile_id !== user.id) {
    redirect(ROUTES.CLIENT_DASHBOARD)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <SectionHeader
        title="Ticket Details"
        description="View and respond to your support ticket"
        align="start"
      />

      <TicketDetail ticket={ticket} currentUserId={user.id} isAdmin={false} />
    </div>
  )
}
