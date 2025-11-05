'use client'

import Link from 'next/link'
import { CreditCard, Globe, LifeBuoy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'

type Subscription = Database['public']['Tables']['subscription']['Row'] & {
  plan: Database['public']['Tables']['plan']['Row'] | null
}

interface DashboardSummaryCardsProps {
  subscription: Subscription | null
  sitesCount: number
  activeSitesCount: number
  sitesInProgressCount: number
  openTicketsCount: number
}

export function DashboardSummaryCards({
  subscription,
  sitesCount,
  activeSitesCount,
  sitesInProgressCount,
  openTicketsCount,
}: DashboardSummaryCardsProps) {
  const liveRate = sitesCount > 0 ? Math.round((activeSitesCount / Math.max(sitesCount, 1)) * 100) : 0
  const hasSubscription = Boolean(subscription)
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Account summary">
      <Item variant="outline" role="listitem">
        <ItemMedia variant="icon">
          <CreditCard aria-hidden="true" />
        </ItemMedia>
        <ItemHeader>
          <ItemTitle>Subscription Plan</ItemTitle>
          {hasSubscription && subscription ? (
            <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
              {subscription.status}
            </Badge>
          ) : null}
        </ItemHeader>
        <ItemContent>
          {hasSubscription && subscription ? (
            <>
              <ItemTitle>{subscription.plan?.name}</ItemTitle>
              <ItemDescription>
                Renews on{' '}
                {subscription.current_period_end
                  ? new Date(subscription.current_period_end).toLocaleDateString()
                  : '—'}
              </ItemDescription>
            </>
          ) : (
            <ItemDescription>No active subscription</ItemDescription>
          )}
        </ItemContent>
        <ItemFooter>
          {hasSubscription && subscription ? (
            <Button asChild variant="outline">
              <Link href={ROUTES.CLIENT_SUBSCRIPTION}>Manage Subscription</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href={ROUTES.PRICING}>View Plans</Link>
            </Button>
          )}
        </ItemFooter>
      </Item>

      <Item variant="outline" role="listitem">
        <ItemMedia variant="icon">
          <Globe aria-hidden="true" />
        </ItemMedia>
        <ItemHeader>
          <ItemTitle>Websites</ItemTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary">{sitesCount}</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total websites</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ItemHeader>
        <ItemContent>
          {sitesCount > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Live</div>
                  <div className="text-sm text-muted-foreground">Currently deployed</div>
                </div>
                <Badge variant="default">{activeSitesCount}</Badge>
              </div>
              {sitesInProgressCount > 0 && (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">In Progress</div>
                    <div className="text-sm text-muted-foreground">Development underway</div>
                  </div>
                  <Badge variant="secondary">{sitesInProgressCount}</Badge>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Live ratio</div>
                    <div className="text-sm text-muted-foreground">Share of active sites</div>
                  </div>
                  <Badge variant="outline">{liveRate}%</Badge>
                </div>
              </div>
            </div>
          ) : (
            <ItemDescription>
              No sites deployed yet{subscription ? '. Your site deployment will begin soon.' : ''}
            </ItemDescription>
          )}
        </ItemContent>
        {sitesCount > 0 && (
          <ItemFooter>
            <Button asChild variant="link">
              <Link href={ROUTES.CLIENT_SITES}>View all sites</Link>
            </Button>
          </ItemFooter>
        )}
      </Item>

      <Item variant="outline" role="listitem">
        <ItemMedia variant="icon">
          <LifeBuoy aria-hidden="true" />
        </ItemMedia>
        <ItemHeader>
          <ItemTitle>Support</ItemTitle>
          <Badge variant={openTicketsCount > 0 ? 'destructive' : 'secondary'}>
            {openTicketsCount > 0 ? openTicketsCount : 0}
          </Badge>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>{openTicketsCount}</ItemTitle>
          <ItemDescription>
            {openTicketsCount === 1 ? 'Open ticket' : 'Open tickets'}
          </ItemDescription>
          <ItemDescription>
            {openTicketsCount > 0 ? 'Follow up pending' : 'All caught up'}
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <Button asChild>
            <Link href={ROUTES.CLIENT_SUPPORT}>
              {openTicketsCount > 0 ? 'View Tickets' : 'Create Ticket'}
            </Link>
          </Button>
        </ItemFooter>
      </Item>
    </div>
  )
}
