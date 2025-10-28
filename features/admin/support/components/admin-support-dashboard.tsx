import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { TicketList, type TicketWithProfile } from '@/features/shared/support'

interface AdminSupportDashboardProps {
  tickets: TicketWithProfile[]
}

export function AdminSupportDashboard({ tickets }: AdminSupportDashboardProps) {
  const openTickets = tickets.filter((t) => t.status === 'open')
  const inProgressTickets = tickets.filter((t) => t.status === 'in_progress')
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved')
  const closedTickets = tickets.filter((t) => t.status === 'closed')

  const totalCount = tickets.length
  const openRate = totalCount > 0 ? (openTickets.length / totalCount) * 100 : 0
  const resolutionRate = totalCount > 0 ? (resolvedTickets.length / totalCount) * 100 : 0

  const stats = [
    {
      label: 'Open',
      value: openTickets.length,
      description: `${openRate.toFixed(0)}% of tickets need attention`,
    },
    {
      label: 'In Progress',
      value: inProgressTickets.length,
      description: 'Actively being worked by support',
    },
    {
      label: 'Resolved',
      value: resolvedTickets.length,
      description: `${resolutionRate.toFixed(0)}% resolved overall`,
    },
    {
      label: 'Closed',
      value: closedTickets.length,
      description: 'Archived conversations',
    },
  ]

  return (
    <div className="space-y-6">
      <Item variant="outline" className="bg-card flex flex-col">
        <ItemHeader>
          <ItemTitle>Support Tickets</ItemTitle>
          <ItemDescription>Manage all customer support requests</ItemDescription>
        </ItemHeader>
      </Item>

      <ItemGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Item
            key={stat.label}
            variant="outline"
            className="flex h-full flex-col"
            aria-label={`${stat.label} tickets summary`}
          >
            <ItemContent className="space-y-3">
              <div className="flex items-center justify-between">
                <ItemTitle>{stat.label}</ItemTitle>
                <Badge variant={stat.value > 0 ? 'default' : 'secondary'}>
                  {stat.value}
                </Badge>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <ItemDescription>{stat.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>

      <Tabs defaultValue="open">
        <TabsList aria-label="Support ticket filters">
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
