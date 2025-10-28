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
  ItemGroup,
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
    <ItemGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Item variant="outline" className="flex h-full flex-col">
        <ItemContent className="space-y-3">
          <div className="flex items-center justify-between">
            <ItemTitle>Total Clients</ItemTitle>
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
          </div>
          <div className="text-2xl font-bold">{stats.totalClients}</div>
          <ItemDescription>
            {stats.activeSubscriptions} active subscriptions
          </ItemDescription>
          <Progress value={subscriptionRate} />
          <ItemDescription>
            {subscriptionRate.toFixed(1)}% subscription rate
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex h-full flex-col">
        <ItemContent className="space-y-3">
          <div className="flex items-center justify-between">
            <ItemTitle>Active Subscriptions</ItemTitle>
            <Badge variant="default">{stats.activeSubscriptions}</Badge>
          </div>
          <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
          <ItemDescription>Paying clients</ItemDescription>
        </ItemContent>
        <ItemActions className="justify-end">
          <Button asChild variant="link" size="sm" className="px-0">
            <Link href={ROUTES.ADMIN_CLIENTS}>View all clients →</Link>
          </Button>
        </ItemActions>
      </Item>

      <Item variant="outline" className="flex h-full flex-col">
        <ItemContent className="space-y-3">
          <div className="flex items-center justify-between">
            <ItemTitle>Live Sites</ItemTitle>
            <Badge variant="default">{stats.liveSites}</Badge>
          </div>
          <div className="text-2xl font-bold">{stats.liveSites}</div>
          <ItemDescription>Deployed websites</ItemDescription>
          <Progress value={liveRate} />
          <ItemDescription>
            {liveRate.toFixed(1)}% deployment rate
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex h-full flex-col">
        <ItemContent className="space-y-3">
          <div className="flex items-center justify-between">
            <ItemTitle>Open Tickets</ItemTitle>
            <Badge variant={stats.openTickets > 0 ? 'destructive' : 'secondary'}>
              {stats.openTickets > 0 ? stats.openTickets : 0}
            </Badge>
          </div>
          <div className="text-2xl font-bold">{stats.openTickets}</div>
          <ItemDescription>Needs attention</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            asChild
            variant={stats.openTickets > 0 ? 'default' : 'outline'}
            size="sm"
            className="w-full"
          >
            <Link href={ROUTES.ADMIN_SUPPORT}>
              {stats.openTickets > 0 ? 'View Tickets' : 'All Tickets'}
            </Link>
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  )
}
