'use client'

import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'

interface PlatformMetricsProps {
  totalClients: number
  activeSubscriptions: number
  liveSites: number
}

export function PlatformMetrics({ totalClients, activeSubscriptions, liveSites }: PlatformMetricsProps) {
  const subscriptionRate = totalClients > 0
    ? (activeSubscriptions / totalClients) * 100
    : 0

  const liveRate = activeSubscriptions > 0
    ? (liveSites / activeSubscriptions) * 100
    : 0

  return (
    <Item variant="outline" className="flex h-full flex-col">
      <ItemHeader className="gap-1">
        <ItemTitle>Platform Metrics</ItemTitle>
        <ItemDescription>Key performance indicators</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <ItemGroup className="space-y-2">
          <Item variant="muted" size="sm" className="items-start justify-between">
            <ItemContent className="space-y-0.5">
              <ItemTitle>Conversion Rate</ItemTitle>
              <ItemDescription>Clients to active subscriptions</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="default" className="px-3 py-1 text-lg">
                {subscriptionRate.toFixed(0)}%
              </Badge>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item variant="muted" size="sm" className="items-start justify-between">
            <ItemContent className="space-y-0.5">
              <ItemTitle>Deployment Rate</ItemTitle>
              <ItemDescription>Subscriptions with live sites</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="default" className="px-3 py-1 text-lg">
                {liveRate.toFixed(0)}%
              </Badge>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item variant="muted" size="sm" className="items-start justify-between">
            <ItemContent className="space-y-0.5">
              <ItemTitle>Average Sites</ItemTitle>
              <ItemDescription>Sites per active subscription</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="secondary" className="px-3 py-1 text-lg">
                {activeSubscriptions > 0
                  ? (liveSites / activeSubscriptions).toFixed(1)
                  : '0.0'}
              </Badge>
            </ItemActions>
          </Item>
        </ItemGroup>
      </ItemContent>
    </Item>
  )
}
