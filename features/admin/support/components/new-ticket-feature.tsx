import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { CreateTicketForm } from './create-ticket-form'

export async function NewTicketFeature(): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  return (
    <div className="max-w-3xl">
      <CreateTicketForm />
    </div>
  )
}
