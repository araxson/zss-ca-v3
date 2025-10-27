import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { CreateTicketForm } from '@/features/shared/support/components/create-ticket-form'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function NewSupportTicketPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Create Support Ticket</CardTitle>
          <CardDescription>Submit a new support request</CardDescription>
        </CardHeader>
      </Card>

      <CreateTicketForm />
    </div>
  )
}
