'use client'

import Link from 'next/link'
import { Users, CreditCard, Globe, TicketCheck } from 'lucide-react'
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
  ItemContent,
  ItemDescription,
  ItemMedia,
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Item variant="outline" aria-label="Total clients metric">
        <ItemMedia variant="icon">
          <Users aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <ItemTitle>Total Clients</ItemTitle>
                <ItemDescription>
                  {stats.activeSubscriptions} active subscriptions
                </ItemDescription>
              </div>
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
            <div className="space-y-2">
              <Progress value={subscriptionRate} aria-label="Subscription rate" />
              <ItemDescription>
                {subscriptionRate.toFixed(1)}% subscription rate
              </ItemDescription>
            </div>
          </div>
        </ItemContent>
      </Item>

      <Item variant="outline" aria-label="Active subscriptions metric">
        <ItemMedia variant="icon">
          <CreditCard aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <ItemTitle>Active Subscriptions</ItemTitle>
                <ItemDescription>Paying clients</ItemDescription>
              </div>
              <Badge variant="default">{stats.activeSubscriptions}</Badge>
            </div>
            <Button asChild variant="link" size="sm" className="h-auto p-0">
              <Link href={ROUTES.ADMIN_CLIENTS}>View all clients</Link>
            </Button>
          </div>
        </ItemContent>
      </Item>

      <Item variant="outline" aria-label="Live sites metric">
        <ItemMedia variant="icon">
          <Globe aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <ItemTitle>Live Sites</ItemTitle>
                <ItemDescription>Deployed websites</ItemDescription>
              </div>
              <Badge variant="default">{stats.liveSites}</Badge>
            </div>
            <div className="space-y-2">
              <Progress value={liveRate} aria-label="Deployment rate" />
              <ItemDescription>
                {liveRate.toFixed(1)}% deployment rate
              </ItemDescription>
            </div>
          </div>
        </ItemContent>
      </Item>

      <Item variant="outline" aria-label="Open tickets metric">
        <ItemMedia variant="icon">
          <TicketCheck aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <ItemTitle>Open Tickets</ItemTitle>
                <ItemDescription>Needs attention</ItemDescription>
              </div>
              <Badge variant={stats.openTickets > 0 ? 'destructive' : 'secondary'}>
                {stats.openTickets > 0 ? stats.openTickets : 0}
              </Badge>
            </div>
            <Button
              asChild
              variant={stats.openTickets > 0 ? 'default' : 'outline'}
              size="sm"
            >
              <Link href={ROUTES.ADMIN_SUPPORT}>
                {stats.openTickets > 0 ? 'View Tickets' : 'All Tickets'}
              </Link>
            </Button>
          </div>
        </ItemContent>
      </Item>
    </div>
  )
}
