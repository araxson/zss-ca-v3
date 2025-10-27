import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="h-full">
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle>{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Active in this queue
              </div>
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
