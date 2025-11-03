import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { CreateTicketForm } from './create-ticket-form'
import { Item, ItemHeader, ItemTitle, ItemDescription } from '@/components/ui/item'

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
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle className="text-3xl font-bold tracking-tight">Create Support Ticket</ItemTitle>
          <ItemDescription>Submit a new support request</ItemDescription>
        </ItemHeader>
      </Item>

      <CreateTicketForm />
    </div>
  )
}
