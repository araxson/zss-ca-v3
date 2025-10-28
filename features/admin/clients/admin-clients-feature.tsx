import { redirect } from 'next/navigation'
import { Users, BadgeCheck, UserMinus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getAllClients, ClientsTable } from '@/features/admin/clients'
import { SectionHeader } from '@/features/shared/components'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'
import { EmptyMedia } from '@/components/ui/empty'

export async function AdminClientsFeature() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase.from('profile').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  const clients = await getAllClients()
  const activeClients = clients.filter((c) => c.subscription)
  const inactiveClients = clients.filter((c) => !c.subscription)

  return (
    <div className="space-y-6">
      <SectionHeader title="Clients" description="Manage all client accounts" align="start" />

      <ItemGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Item variant="outline" className="flex flex-col" aria-label="Total clients summary">
          <ItemContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Total Clients</div>
              <EmptyMedia variant="icon">
                <Users className="size-4" aria-hidden="true" />
              </EmptyMedia>
            </div>
            <div className="text-2xl font-bold">{clients.length}</div>
            <div className="text-sm text-muted-foreground">Cumulative accounts in the workspace</div>
          </ItemContent>
        </Item>
        <Item variant="outline" className="flex flex-col" aria-label="Active subscriptions summary">
          <ItemContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Active Subscriptions</div>
              <EmptyMedia variant="icon">
                <BadgeCheck className="size-4" aria-hidden="true" />
              </EmptyMedia>
            </div>
            <div className="text-2xl font-bold">{activeClients.length}</div>
            <div className="text-sm text-muted-foreground">Clients with an active billing plan</div>
          </ItemContent>
        </Item>
        <Item variant="outline" className="flex flex-col" aria-label="Clients without subscription summary">
          <ItemContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">No Subscription</div>
              <EmptyMedia variant="icon">
                <UserMinus className="size-4" aria-hidden="true" />
              </EmptyMedia>
            </div>
            <div className="text-2xl font-bold">{inactiveClients.length}</div>
            <div className="text-sm text-muted-foreground">Clients awaiting plan assignment</div>
          </ItemContent>
        </Item>
      </ItemGroup>

      <ClientsTable clients={clients} />
    </div>
  )
}
