import 'server-only'

import { redirect } from 'next/navigation'
import { Users, BadgeCheck, UserMinus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { listClients, ClientsTable } from '@/features/admin/clients'
import { Badge } from '@/components/ui/badge'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'

export async function ClientsPageFeature() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // ✅ Parallel data fetching to avoid waterfall
  const [profileResult, clients] = await Promise.all([
    supabase.from('profile').select('role').eq('id', user.id).single(),
    listClients(),
  ])

  const { data: profile } = profileResult
  if (profile?.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)
  const activeClients = clients.filter((c) => c.subscription)
  const inactiveClients = clients.filter((c) => !c.subscription)

  return (
    <div className="space-y-6">
      <ItemGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Item variant="outline" aria-label="Total clients summary">
          <ItemMedia variant="icon">
            <Users aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Total Clients</ItemTitle>
            <ItemDescription>Cumulative accounts in the workspace</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="secondary">{clients.length}</Badge>
          </ItemActions>
        </Item>
        <Item variant="outline" aria-label="Active subscriptions summary">
          <ItemMedia variant="icon">
            <BadgeCheck aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Active Subscriptions</ItemTitle>
            <ItemDescription>Clients with an active billing plan</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="default">{activeClients.length}</Badge>
          </ItemActions>
        </Item>
        <Item variant="outline" aria-label="Clients without subscription summary">
          <ItemMedia variant="icon">
            <UserMinus aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>No Subscription</ItemTitle>
            <ItemDescription>Clients awaiting plan assignment</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="outline">{inactiveClients.length}</Badge>
          </ItemActions>
        </Item>
      </ItemGroup>

      <ClientsTable clients={clients} />
    </div>
  )
}
