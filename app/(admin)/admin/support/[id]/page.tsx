import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getTicketById } from '@/features/shared/support/api/queries'
import { TicketDetail } from '@/features/shared/support/components/ticket-detail'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

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
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Ticket Not Found</CardTitle>
            <CardDescription>The ticket could not be located.</CardDescription>
          </CardHeader>
        </Card>
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            The ticket you&apos;re looking for doesn&apos;t exist.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
          <CardDescription>View and manage support ticket</CardDescription>
        </CardHeader>
      </Card>

      <TicketDetail ticket={ticket} currentUserId={user.id} isAdmin={true} />
    </div>
  )
}
