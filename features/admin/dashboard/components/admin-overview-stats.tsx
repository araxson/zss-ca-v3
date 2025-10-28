'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from '@/components/ui/item'
import { ROUTES } from '@/lib/constants/routes'

interface AdminOverviewStatsProps {
  stats: {
    totalClients: number
    activeSubscriptions: number
    liveSites: number
    openTickets: number
  }
}

export function AdminOverviewStats({ stats }: AdminOverviewStatsProps) {
  const subscriptionRate = stats.totalClients > 0
    ? (stats.activeSubscriptions / stats.totalClients) * 100
    : 0

  const liveRate = stats.activeSubscriptions > 0
    ? (stats.liveSites / stats.activeSubscriptions) * 100
    : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Item variant="outline" aria-label="Total clients metric">
        <ItemContent>
          <ItemTitle>Total Clients</ItemTitle>
          <ItemDescription>
            {stats.activeSubscriptions} active subscriptions
          </ItemDescription>
        </ItemContent>
        <ItemActions>
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
        </ItemActions>
        <ItemFooter>
          <Progress value={subscriptionRate} />
          <ItemDescription className="mt-2">
            {subscriptionRate.toFixed(1)}% subscription rate
          </ItemDescription>
        </ItemFooter>
      </Item>

      <Item variant="outline" aria-label="Active subscriptions metric">
        <ItemContent>
          <ItemTitle>Active Subscriptions</ItemTitle>
          <ItemDescription>Paying clients</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="default">{stats.activeSubscriptions}</Badge>
        </ItemActions>
        <ItemFooter>
          <Button asChild variant="link" size="sm">
            <Link href={ROUTES.ADMIN_CLIENTS}>View all clients</Link>
          </Button>
        </ItemFooter>
      </Item>

      <Item variant="outline" aria-label="Live sites metric">
        <ItemContent>
          <ItemTitle>Live Sites</ItemTitle>
          <ItemDescription>Deployed websites</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="default">{stats.liveSites}</Badge>
        </ItemActions>
        <ItemFooter>
          <Progress value={liveRate} />
          <ItemDescription className="mt-2">
            {liveRate.toFixed(1)}% deployment rate
          </ItemDescription>
        </ItemFooter>
      </Item>

      <Item variant="outline" aria-label="Open tickets metric">
        <ItemContent>
          <ItemTitle>Open Tickets</ItemTitle>
          <ItemDescription>Needs attention</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant={stats.openTickets > 0 ? 'destructive' : 'secondary'}>
            {stats.openTickets > 0 ? stats.openTickets : 0}
          </Badge>
        </ItemActions>
        <ItemFooter>
          <Button
            asChild
            variant={stats.openTickets > 0 ? 'default' : 'outline'}
            size="sm"
          >
            <Link href={ROUTES.ADMIN_SUPPORT}>
              {stats.openTickets > 0 ? 'View Tickets' : 'All Tickets'}
            </Link>
          </Button>
        </ItemFooter>
      </Item>
    </div>
  )
}
