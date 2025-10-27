import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Item variant="outline" className="flex flex-col">
        <ItemContent className="space-y-4">
          <div className="flex items-center justify-between">
            <ItemTitle>Subscription Plan</ItemTitle>
            {subscription && (
              <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                {subscription.status}
              </Badge>
            )}
          </div>
          {subscription ? (
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{subscription.plan?.name}</div>
                <p className="text-xs text-muted-foreground mt-1">Active subscription</p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href={ROUTES.CLIENT_SUBSCRIPTION}>Manage Subscription</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                No active subscription
              </div>
              <Button asChild className="w-full">
                <Link href={ROUTES.PRICING}>View Plans</Link>
              </Button>
            </div>
          )}
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex flex-col">
        <ItemContent className="space-y-4">
          <div className="flex items-center justify-between">
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
          </div>
          {sitesCount > 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Live</span>
                  <Badge variant="default">{activeSitesCount}</Badge>
                </div>
                {sitesInProgressCount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">In Progress</span>
                    <Badge variant="secondary">{sitesInProgressCount}</Badge>
                  </div>
                )}
              </div>
              <Button asChild variant="link" size="sm" className="px-0">
                <Link href={ROUTES.CLIENT_SITES}>View all sites →</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">No sites deployed yet</div>
              {subscription && (
                <p className="text-xs text-muted-foreground">
                  Your site deployment will begin soon
                </p>
              )}
            </div>
          )}
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex flex-col">
        <ItemContent className="space-y-4">
          <div className="flex items-center justify-between">
            <ItemTitle>Support</ItemTitle>
            {openTicketsCount > 0 ? (
              <Badge variant="destructive">{openTicketsCount}</Badge>
            ) : (
              <Badge variant="secondary">0</Badge>
            )}
          </div>
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
        </ItemContent>
      </Item>
    </div>
  )
}
