import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { CreateTicketForm } from '@/features/shared/support'
import { SectionHeader } from '@/features/shared/components'

export async function NewTicketFeature() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <SectionHeader
        title="Create Support Ticket"
        description="Submit a new support request"
        align="start"
      />

      <CreateTicketForm />
    </div>
  )
}
