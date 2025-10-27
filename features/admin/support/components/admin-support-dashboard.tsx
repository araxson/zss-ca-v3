import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>Manage all customer support requests</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <Badge variant={stat.value > 0 ? 'default' : 'secondary'}>
                {stat.value}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                Active in this queue
              </p>
            </CardContent>
          </Card>
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
