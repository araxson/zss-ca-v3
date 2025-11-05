import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getTicketById } from '@/features/client/support/api/queries'
import { TicketDetail } from './ticket-detail'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface TicketDetailFeatureProps {
  id: string
}

export async function TicketDetailFeature({ id }: TicketDetailFeatureProps): Promise<React.JSX.Element> {
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
    )
  }

  if (ticket.profile_id !== user.id) {
    redirect(ROUTES.CLIENT_DASHBOARD)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={ROUTES.CLIENT_DASHBOARD}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={ROUTES.CLIENT_SUPPORT}>Support</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{ticket.subject || 'Ticket'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <TicketDetail ticket={ticket} currentUserId={user.id} isAdmin={false} />
    </div>
  )
}
