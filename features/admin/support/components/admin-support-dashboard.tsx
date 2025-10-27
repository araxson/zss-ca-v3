import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { TicketList } from '@/features/shared/support/components/ticket-list'
import type { TicketWithProfile } from '@/features/shared/support/api/queries'

interface AdminSupportDashboardProps {
  tickets: TicketWithProfile[]
}

export function AdminSupportDashboard({ tickets }: AdminSupportDashboardProps) {
  const openTickets = tickets.filter((t) => t.status === 'open')
  const inProgressTickets = tickets.filter((t) => t.status === 'in_progress')
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved')
  const closedTickets = tickets.filter((t) => t.status === 'closed')

  const stats = [
    { label: 'Open', value: openTickets.length },
    { label: 'In Progress', value: inProgressTickets.length },
    { label: 'Resolved', value: resolvedTickets.length },
    { label: 'Closed', value: closedTickets.length },
  ]

  return (
    <div className="space-y-6">
      <Item variant="outline" className="bg-card flex flex-col">
        <ItemHeader>
          <ItemTitle>Support Tickets</ItemTitle>
          <ItemDescription>Manage all customer support requests</ItemDescription>
        </ItemHeader>
      </Item>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Item key={stat.label} variant="outline" className="flex h-full flex-col">
            <ItemContent className="space-y-3">
              <div className="flex items-center justify-between">
                <ItemTitle>{stat.label}</ItemTitle>
                <Badge variant={stat.value > 0 ? 'default' : 'secondary'}>
                  {stat.value}
                </Badge>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <ItemDescription>Active in this queue</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </div>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Open ({openTickets.length})</TabsTrigger>
          <TabsTrigger value="in_progress">
            In Progress ({inProgressTickets.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedTickets.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closedTickets.length})</TabsTrigger>
          <TabsTrigger value="all">All ({tickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-6">
          <TicketList tickets={openTickets} basePath="/admin/support" />
        </TabsContent>

        <TabsContent value="in_progress" className="mt-6">
          <TicketList tickets={inProgressTickets} basePath="/admin/support" />
        </TabsContent>

        <TabsContent value="resolved" className="mt-6">
          <TicketList tickets={resolvedTickets} basePath="/admin/support" />
        </TabsContent>

        <TabsContent value="closed" className="mt-6">
          <TicketList tickets={closedTickets} basePath="/admin/support" />
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <TicketList tickets={tickets} basePath="/admin/support" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
