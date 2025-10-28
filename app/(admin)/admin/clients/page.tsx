import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getAllClients, ClientsTable } from '@/features/admin/clients'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { Users, BadgeCheck, UserMinus } from 'lucide-react'
import { EmptyMedia } from '@/components/ui/empty'

export default async function AdminClientsPage() {
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

  const clients = await getAllClients()

  const activeClients = clients.filter((c) => c.subscription)
  const inactiveClients = clients.filter((c) => !c.subscription)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Clients"
        description="Manage all client accounts"
        align="start"
      />

      <ItemGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Item variant="outline" className="flex flex-col">
          <ItemContent className="space-y-3">
            <div className="flex items-center justify-between">
              <ItemTitle>Total Clients</ItemTitle>
              <EmptyMedia variant="icon">
                <Users className="h-4 w-4" aria-hidden="true" />
              </EmptyMedia>
            </div>
            <div className="text-2xl font-bold">{clients.length}</div>
            <ItemDescription>Cumulative accounts in the workspace</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline" className="flex flex-col">
          <ItemContent className="space-y-3">
            <div className="flex items-center justify-between">
              <ItemTitle>Active Subscriptions</ItemTitle>
              <EmptyMedia variant="icon">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              </EmptyMedia>
            </div>
            <div className="text-2xl font-bold">{activeClients.length}</div>
            <ItemDescription>Clients with an active billing plan</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline" className="flex flex-col">
          <ItemContent className="space-y-3">
            <div className="flex items-center justify-between">
              <ItemTitle>No Subscription</ItemTitle>
              <EmptyMedia variant="icon">
                <UserMinus className="h-4 w-4" aria-hidden="true" />
              </EmptyMedia>
            </div>
            <div className="text-2xl font-bold">{inactiveClients.length}</div>
            <ItemDescription>Clients awaiting plan assignment</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>

      <ClientsTable clients={clients} />
    </div>
  )
}
