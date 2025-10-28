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

export default async function AdminTicketDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect(ROUTES.CLIENT_DASHBOARD)
  }

  const ticket = await getTicketById(id)

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyTitle>Ticket Not Found</EmptyTitle>
            <EmptyDescription>The ticket could not be located.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Alert>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                The ticket you&apos;re looking for doesn&apos;t exist.
              </AlertDescription>
            </Alert>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <SectionHeader
        title="Ticket Details"
        description="View and manage support ticket"
        align="start"
      />

      <TicketDetail ticket={ticket} currentUserId={user.id} isAdmin={true} />
    </div>
  )
}
