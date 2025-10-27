import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import type { Database } from '@/lib/types/database.types'
import { ROUTES } from '@/lib/constants/routes'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

type SupportTicket = Database['public']['Tables']['support_ticket']['Row']

interface DashboardTicketsTabProps {
  tickets: SupportTicket[]
  ticketChartData: Array<{ name: string; count: number }>
  openTicketsCount: number
}

export function DashboardTicketsTab({
  tickets,
  ticketChartData,
  openTicketsCount,
}: DashboardTicketsTabProps) {
  if (tickets.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No support tickets</EmptyTitle>
          <EmptyDescription>You haven&apos;t submitted any support requests yet</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href={ROUTES.CLIENT_SUPPORT}>Create Ticket</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Status</CardTitle>
            <CardDescription>Distribution of your tickets by status</CardDescription>
          </CardHeader>
          <CardContent>
            {ticketChartData.length > 0 ? (
              <ChartContainer
                config={{
                  count: {
                    label: 'Tickets',
                    color: 'hsl(var(--chart-3))',
                  },
                }}
                className="h-52"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ticketChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <Empty className="h-52">
                <EmptyHeader>
                  <EmptyTitle>No ticket data</EmptyTitle>
                  <EmptyDescription>Ticket statistics will appear here</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support Summary</CardTitle>
            <CardDescription>Your support request overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Item>
              <ItemContent>
                <ItemTitle>Total Tickets</ItemTitle>
                <ItemDescription>All support requests</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {tickets.length}
                </Badge>
              </ItemActions>
            </Item>
            <Separator />
            <Item>
              <ItemContent>
                <ItemTitle>Open Tickets</ItemTitle>
                <ItemDescription>Awaiting response</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge
                  variant={openTicketsCount > 0 ? 'destructive' : 'secondary'}
                  className="text-lg px-3 py-1"
                >
                  {openTicketsCount}
                </Badge>
              </ItemActions>
            </Item>
            <Separator />
            <Button asChild className="w-full">
              <Link href={ROUTES.CLIENT_SUPPORT}>View All Tickets</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Support Tickets</CardTitle>
          <CardDescription>Your latest support requests</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`${ROUTES.CLIENT_SUPPORT}/${ticket.id}`}
                        className="hover:underline"
                      >
                        {ticket.subject}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.status === 'open'
                            ? 'destructive'
                            : ticket.status === 'in_progress'
                              ? 'default'
                              : 'secondary'
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.priority === 'urgent'
                            ? 'destructive'
                            : ticket.priority === 'high'
                              ? 'default'
                              : 'secondary'
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  )
}
