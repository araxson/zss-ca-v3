'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

type Profile = Database['public']['Tables']['profile']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row'] & {
  plan: Database['public']['Tables']['plan']['Row'] | null
}
type ClientSite = Database['public']['Tables']['client_site']['Row']
type SupportTicket = Database['public']['Tables']['support_ticket']['Row']

interface DashboardOverviewProps {
  profile: Profile | null
  subscription: Subscription | null
  sites: ClientSite[]
  tickets: SupportTicket[]
  openTicketsCount: number
}

export function DashboardOverview({
  profile,
  subscription,
  sites,
  tickets,
  openTicketsCount,
}: DashboardOverviewProps) {
  const activeSites = sites.filter(s => s.status === 'live')
  const sitesInProgress = sites.filter(s =>
    ['pending', 'in_production', 'awaiting_client_content', 'ready_for_review'].includes(s.status)
  )

  // Calculate site progress for in-progress sites
  const getStatusProgress = (status: string) => {
    const statusMap: Record<string, number> = {
      pending: 10,
      in_production: 40,
      awaiting_client_content: 60,
      ready_for_review: 80,
      live: 100,
    }
    return statusMap[status] ?? 0
  }

  const getStatusLabel = (status: string) => {
    const labelMap: Record<string, string> = {
      pending: 'Pending',
      in_production: 'In Production',
      awaiting_client_content: 'Awaiting Content',
      ready_for_review: 'Ready for Review',
      live: 'Live',
    }
    return labelMap[status] ?? status
  }

  // Chart data for ticket status distribution
  const ticketsByStatus = tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const ticketChartData = Object.entries(ticketsByStatus).map(([status, count]) => ({
    name: status.replace('_', ' '),
    count,
  }))

  // Chart colors
  const CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ]

  // Site status distribution for chart
  const sitesByStatus = sites.reduce((acc, site) => {
    const label = getStatusLabel(site.status)
    acc[label] = (acc[label] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const siteStatusChartData = Object.entries(sitesByStatus).map(([name, count]) => ({
    name,
    count,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{profile?.company_name ? `, ${profile.company_name}` : ''}
        </h1>
        <p className="text-muted-foreground">Here's an overview of your account</p>
      </div>

      <Separator />

      {!subscription && (
        <Alert>
          <AlertTitle>No active subscription</AlertTitle>
          <AlertDescription>
            Subscribe to a plan to get started with your website.
          </AlertDescription>
          <div className="mt-4 flex justify-start sm:justify-end">
            <Button asChild>
              <Link href={ROUTES.PRICING}>
                View Plans
              </Link>
            </Button>
          </div>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Plan</CardTitle>
            {subscription && (
              <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                {subscription.status}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">{subscription.plan?.name}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active subscription
                  </p>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href={ROUTES.CLIENT_SUBSCRIPTION}>
                    Manage Subscription
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  No active subscription
                </div>
                <Button asChild className="w-full">
                  <Link href={ROUTES.PRICING}>
                    View Plans
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Websites</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary">{sites.length}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total websites</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            {sites.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Live</span>
                    <Badge variant="default">{activeSites.length}</Badge>
                  </div>
                  {sitesInProgress.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">In Progress</span>
                      <Badge variant="secondary">{sitesInProgress.length}</Badge>
                    </div>
                  )}
                </div>
                <Button asChild variant="link" size="sm" className="px-0">
                  <Link href={ROUTES.CLIENT_SITES}>
                    View all sites →
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  No sites deployed yet
                </div>
                {subscription && (
                  <p className="text-xs text-muted-foreground">
                    Your site deployment will begin soon
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support</CardTitle>
            {openTicketsCount > 0 ? (
              <Badge variant="destructive">{openTicketsCount}</Badge>
            ) : (
              <Badge variant="secondary">0</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{openTicketsCount}</div>
                <p className="text-xs text-muted-foreground">
                  {openTicketsCount === 1 ? 'Open ticket' : 'Open tickets'}
                </p>
              </div>
              <Button asChild className="w-full">
                <Link href={ROUTES.CLIENT_SUPPORT}>
                  {openTicketsCount > 0 ? 'View Tickets' : 'Create Ticket'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sites" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sites">My Websites</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="sites" className="space-y-4">
          {sites.length > 0 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Site Status Overview</CardTitle>
                    <CardDescription>Distribution of your websites by status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        count: {
                          label: 'Sites',
                          color: 'hsl(var(--chart-1))',
                        },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={siteStatusChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={70}
                            fill="hsl(var(--chart-1))"
                            dataKey="count"
                          >
                            {siteStatusChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Site Summary</CardTitle>
                    <CardDescription>Quick stats about your websites</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Item>
                      <ItemContent>
                        <ItemTitle>Total Sites</ItemTitle>
                        <ItemDescription>All websites in your account</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {sites.length}
                        </Badge>
                      </ItemActions>
                    </Item>
                    <Separator />
                    <Item>
                      <ItemContent>
                        <ItemTitle>Live Sites</ItemTitle>
                        <ItemDescription>Currently deployed and accessible</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Badge variant="default" className="text-lg px-3 py-1">
                          {activeSites.length}
                        </Badge>
                      </ItemActions>
                    </Item>
                    <Separator />
                    <Item>
                      <ItemContent>
                        <ItemTitle>In Progress</ItemTitle>
                        <ItemDescription>Sites being developed</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          {sitesInProgress.length}
                        </Badge>
                      </ItemActions>
                    </Item>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4">
                {sites.map((site) => (
                  <Card key={site.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle>{site.site_name ?? 'Website'}</CardTitle>
                          <CardDescription>
                            {site.custom_domain ?? site.deployment_url ?? 'No domain yet'}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            site.status === 'live'
                              ? 'default'
                              : site.status === 'pending'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {getStatusLabel(site.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{getStatusProgress(site.status)}%</span>
                        </div>
                        <Progress value={getStatusProgress(site.status)} />
                      </div>
                      {site.status === 'live' && (site.custom_domain ?? site.deployment_url) && (
                        <Button asChild variant="outline" className="w-full">
                          <a href={site.custom_domain ?? site.deployment_url ?? '#'} target="_blank" rel="noopener noreferrer">
                            View Site
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No websites yet</EmptyTitle>
                <EmptyDescription>Subscribe to a plan to get started with your website</EmptyDescription>
              </EmptyHeader>
              {!subscription && (
                <EmptyContent>
                  <Button asChild>
                    <Link href={ROUTES.PRICING}>
                      View Plans
                    </Link>
                  </Button>
                </EmptyContent>
              )}
            </Empty>
          )}
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          {tickets.length > 0 ? (
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
                        className="h-[200px]"
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
                      <Empty className="h-[200px]">
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
                        <Badge variant={openTicketsCount > 0 ? 'destructive' : 'secondary'} className="text-lg px-3 py-1">
                          {openTicketsCount}
                        </Badge>
                      </ItemActions>
                    </Item>
                    <Separator />
                    <Button asChild className="w-full">
                      <Link href={ROUTES.CLIENT_SUPPORT}>
                        View All Tickets
                      </Link>
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
                </CardContent>
              </Card>
            </>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No support tickets</EmptyTitle>
                <EmptyDescription>You haven't submitted any support requests yet</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link href={ROUTES.CLIENT_SUPPORT}>
                    Create Ticket
                  </Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="font-medium">{profile?.contact_name ?? '—'}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{profile?.contact_email ?? '—'}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Company</span>
                  <span className="font-medium">{profile?.company_name ?? '—'}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="font-medium">{profile?.contact_phone ?? '—'}</span>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href={ROUTES.CLIENT_PROFILE}>
                  Edit Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <ButtonGroup>
                  <Button asChild variant="outline">
                    <Link href={ROUTES.CLIENT_SITES}>
                      My Websites
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={ROUTES.CLIENT_SUBSCRIPTION}>
                      Subscription
                    </Link>
                  </Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Button asChild variant="outline">
                    <Link href={ROUTES.CLIENT_SUPPORT}>
                      Support
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={ROUTES.CLIENT_NOTIFICATIONS}>
                      Notifications
                    </Link>
                  </Button>
                </ButtonGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
