'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, LifeBuoy, ScrollText, UserCog, Users as UsersIcon, Globe } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { ROUTES } from '@/lib/constants/routes'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

interface AdminOverviewProps {
  stats: {
    totalClients: number
    activeSubscriptions: number
    liveSites: number
    openTickets: number
    recentClients: Array<{
      id: string
      contact_name: string | null
      contact_email: string | null
      company_name: string | null
      created_at: string
    }>
    recentTickets: Array<{
      id: string
      subject: string
      status: string
      priority: string
      created_at: string
      profile: { contact_name: string | null; company_name: string | null } | null
    }>
    planDistribution: Record<string, number>
    statusDistribution: Record<string, number>
  }
}

export function AdminOverview({ stats }: AdminOverviewProps) {
  const router = useRouter()
  const planChartData = Object.entries(stats.planDistribution).map(([name, count]) => ({
    name,
    count,
  }))

  const statusChartData = Object.entries(stats.statusDistribution).map(([name, count]) => ({
    name,
    count,
  }))

  const subscriptionRate = stats.totalClients > 0
    ? (stats.activeSubscriptions / stats.totalClients) * 100
    : 0

  const liveRate = stats.activeSubscriptions > 0
    ? (stats.liveSites / stats.activeSubscriptions) * 100
    : 0

  // Mock trend data for growth chart (last 6 months)
  const trendData = [
    { month: 'May', clients: Math.max(0, stats.totalClients - 25), subscriptions: Math.max(0, stats.activeSubscriptions - 20) },
    { month: 'Jun', clients: Math.max(0, stats.totalClients - 20), subscriptions: Math.max(0, stats.activeSubscriptions - 16) },
    { month: 'Jul', clients: Math.max(0, stats.totalClients - 15), subscriptions: Math.max(0, stats.activeSubscriptions - 12) },
    { month: 'Aug', clients: Math.max(0, stats.totalClients - 10), subscriptions: Math.max(0, stats.activeSubscriptions - 8) },
    { month: 'Sep', clients: Math.max(0, stats.totalClients - 5), subscriptions: Math.max(0, stats.activeSubscriptions - 4) },
    { month: 'Oct', clients: stats.totalClients, subscriptions: stats.activeSubscriptions },
  ]

  // Chart colors
  const CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform performance</p>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Clients</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary">{stats.totalClients}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Registered client accounts</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSubscriptions} active subscriptions
            </p>
            <Progress value={subscriptionRate} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {subscriptionRate.toFixed(1)}% subscription rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active Subscriptions</CardTitle>
            <Badge variant="default">{stats.activeSubscriptions}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Paying clients
            </p>
            <Button asChild variant="link" size="sm" className="mt-3 px-0">
              <Link href={ROUTES.ADMIN_CLIENTS}>
                View all clients →
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Live Sites</CardTitle>
            <Badge variant="default">{stats.liveSites}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.liveSites}</div>
            <p className="text-xs text-muted-foreground">
              Deployed websites
            </p>
            <Progress value={liveRate} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {liveRate.toFixed(1)}% deployment rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Open Tickets</CardTitle>
            {stats.openTickets > 0 ? (
              <Badge variant="destructive">{stats.openTickets}</Badge>
            ) : (
              <Badge variant="secondary">0</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
            <Button
              asChild
              variant={stats.openTickets > 0 ? "default" : "outline"}
              size="sm"
              className="mt-3 w-full"
            >
              <Link href={ROUTES.ADMIN_SUPPORT}>
                {stats.openTickets > 0 ? 'View Tickets' : 'All Tickets'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Recent Clients</TabsTrigger>
          <TabsTrigger value="tickets">Recent Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Growth Trend</CardTitle>
                <CardDescription>Client and subscription growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    clients: {
                      label: 'Clients',
                      color: 'hsl(var(--chart-1))',
                    },
                    subscriptions: {
                      label: 'Subscriptions',
                      color: 'hsl(var(--chart-2))',
                    },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSubscriptions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="clients"
                        stroke="hsl(var(--chart-1))"
                        fill="url(#colorClients)"
                      />
                      <Area
                        type="monotone"
                        dataKey="subscriptions"
                        stroke="hsl(var(--chart-2))"
                        fill="url(#colorSubscriptions)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>Active subscriptions by plan</CardDescription>
              </CardHeader>
              <CardContent>
                {planChartData.length > 0 ? (
                  <ChartContainer
                    config={{
                      count: {
                        label: 'Subscriptions',
                        color: 'hsl(var(--primary))',
                      },
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={planChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="hsl(var(--primary))"
                          dataKey="count"
                        >
                          {planChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <Empty className="h-64">
                    <EmptyHeader>
                      <EmptyTitle>No subscription data</EmptyTitle>
                      <EmptyDescription>No active subscriptions to display</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Site Status Distribution</CardTitle>
                <CardDescription>Websites by deployment status</CardDescription>
              </CardHeader>
              <CardContent>
                {statusChartData.length > 0 ? (
                  <ChartContainer
                    config={{
                      count: {
                        label: 'Sites',
                        color: 'hsl(var(--chart-2))',
                      },
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusChartData} layout="vertical">
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={120} />
                        <ChartTooltip />
                        <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <Empty className="h-64">
                    <EmptyHeader>
                      <EmptyTitle>No site data</EmptyTitle>
                      <EmptyDescription>No sites to display</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Item>
                  <ItemContent>
                    <ItemTitle>Conversion Rate</ItemTitle>
                    <ItemDescription>Clients to active subscriptions</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant="default" className="text-lg px-3 py-1">
                      {subscriptionRate.toFixed(0)}%
                    </Badge>
                  </ItemActions>
                </Item>
                <Separator />
                <Item>
                  <ItemContent>
                    <ItemTitle>Deployment Rate</ItemTitle>
                    <ItemDescription>Subscriptions with live sites</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant="default" className="text-lg px-3 py-1">
                      {liveRate.toFixed(0)}%
                    </Badge>
                  </ItemActions>
                </Item>
                <Separator />
                <Item>
                  <ItemContent>
                    <ItemTitle>Average Sites</ItemTitle>
                    <ItemDescription>Sites per active subscription</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {stats.activeSubscriptions > 0
                        ? (stats.liveSites / stats.activeSubscriptions).toFixed(1)
                        : '0.0'}
                    </Badge>
                  </ItemActions>
                </Item>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Command
                aria-label="Admin quick navigation"
                className="w-full rounded-md border"
              >
                <CommandList>
                  <CommandGroup heading="Management">
                    <CommandItem
                      value="admin-clients"
                      onSelect={() => router.push(ROUTES.ADMIN_CLIENTS)}
                    >
                      <UsersIcon className="mr-2 h-4 w-4" />
                      <span>Manage Clients</span>
                    </CommandItem>
                    <CommandItem
                      value="admin-sites"
                      onSelect={() => router.push(ROUTES.ADMIN_SITES)}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      <span>View Sites</span>
                    </CommandItem>
                    <CommandItem
                      value="admin-support"
                      onSelect={() => router.push(ROUTES.ADMIN_SUPPORT)}
                    >
                      <LifeBuoy className="mr-2 h-4 w-4" />
                      <span>Support</span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Operations">
                    <CommandItem
                      value="admin-audit-logs"
                      onSelect={() => router.push(ROUTES.ADMIN_AUDIT_LOGS)}
                    >
                      <ScrollText className="mr-2 h-4 w-4" />
                      <span>Audit Logs</span>
                    </CommandItem>
                    <CommandItem
                      value="admin-profile"
                      onSelect={() => router.push(ROUTES.ADMIN_PROFILE)}
                    >
                      <UserCog className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </CommandItem>
                    <CommandItem
                      value="admin-notifications"
                      onSelect={() => router.push(ROUTES.ADMIN_NOTIFICATIONS)}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Clients</CardTitle>
              <CardDescription>Latest registered client accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentClients.length > 0 ? (
                <ScrollArea className="rounded-md border">
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recentClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {client.contact_name?.charAt(0).toUpperCase() ?? 'C'}
                              </AvatarFallback>
                            </Avatar>
                            <span>{client.contact_name ?? 'Unknown'}</span>
                          </TableCell>
                          <TableCell>{client.contact_email}</TableCell>
                          <TableCell>{client.company_name ?? '—'}</TableCell>
                          <TableCell>
                            {new Date(client.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              ) : (
                <Empty className="h-52">
                  <EmptyHeader>
                    <EmptyTitle>No clients yet</EmptyTitle>
                    <EmptyDescription>Client accounts will appear here once registered</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Support Tickets</CardTitle>
              <CardDescription>Latest customer support requests</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentTickets.length > 0 ? (
                <ScrollArea className="rounded-md border">
                  <Table className="min-w-[700px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recentTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">
                            <Link
                              href={`${ROUTES.ADMIN_SUPPORT}/${ticket.id}`}
                              className="hover:underline"
                            >
                              {ticket.subject}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {ticket.profile?.company_name ?? ticket.profile?.contact_name ?? 'Unknown'}
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
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              ) : (
                <Empty className="h-52">
                  <EmptyHeader>
                    <EmptyTitle>No tickets yet</EmptyTitle>
                    <EmptyDescription>Support tickets will appear here when clients submit requests</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
