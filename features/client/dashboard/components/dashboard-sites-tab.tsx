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
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { Progress } from '@/components/ui/progress'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { getSiteStatusLabel, getSiteStatusProgress } from './dashboard-site-helpers'

type Subscription = Database['public']['Tables']['subscription']['Row'] | null
type ClientSite = Database['public']['Tables']['client_site']['Row']

interface DashboardSitesTabProps {
  sites: ClientSite[]
  subscription: Subscription
  siteStatusChartData: Array<{ name: string; count: number }>
  activeSitesCount: number
  sitesInProgressCount: number
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
]

export function DashboardSitesTab({
  sites,
  subscription,
  siteStatusChartData,
  activeSitesCount,
  sitesInProgressCount,
}: DashboardSitesTabProps) {
  if (sites.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No websites yet</EmptyTitle>
          <EmptyDescription>Subscribe to a plan to get started with your website</EmptyDescription>
        </EmptyHeader>
        {!subscription && (
          <EmptyContent>
            <Button asChild>
              <Link href={ROUTES.PRICING}>View Plans</Link>
            </Button>
          </EmptyContent>
        )}
      </Empty>
    )
  }

  return (
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
              className="h-52"
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
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
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
                  {activeSitesCount}
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
                  {sitesInProgressCount}
                </Badge>
              </ItemActions>
            </Item>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="grid gap-4 pr-4">
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
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Badge
                        variant={
                          site.status === 'live'
                            ? 'default'
                            : site.status === 'pending'
                              ? 'secondary'
                              : 'outline'
                        }
                        className="cursor-help"
                      >
                        {getSiteStatusLabel(site.status)}
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">
                          {getSiteStatusLabel(site.status)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {site.status === 'pending' && 'Your website is queued for development. Our team will begin work shortly.'}
                          {site.status === 'in_production' && 'Your website is currently being developed by our team.'}
                          {site.status === 'awaiting_client_content' && 'We need content from you to proceed. Please check your support tickets.'}
                          {site.status === 'ready_for_review' && 'Your website is ready for your review. Please provide feedback.'}
                          {site.status === 'live' && 'Your website is live and accessible to the public.'}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <span className="text-xs font-medium">
                            {getSiteStatusProgress(site.status)}%
                          </span>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {getSiteStatusProgress(site.status)}%
                    </span>
                  </div>
                  <Progress value={getSiteStatusProgress(site.status)} />
                </div>
                {site.status === 'live' && (site.custom_domain ?? site.deployment_url) && (
                  <Button asChild variant="outline" className="w-full">
                    <a
                      href={site.custom_domain ?? site.deployment_url ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Site
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </>
  )
}
