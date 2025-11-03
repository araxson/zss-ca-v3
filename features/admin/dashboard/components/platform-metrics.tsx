'use client'

import { Badge } from '@/components/ui/badge'
import {
  Item,
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
    <Item variant="outline" aria-label="Platform metrics summary">
      <ItemHeader>
        <ItemTitle>Platform Metrics</ItemTitle>
        <ItemDescription>Key performance indicators</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <ItemGroup>
          <Item variant="muted" size="sm">
            <ItemContent>
              <ItemTitle>Conversion Rate</ItemTitle>
              <ItemDescription>Clients to active subscriptions</ItemDescription>
            </ItemContent>
            <Badge variant="default">
              {subscriptionRate.toFixed(0)}%
            </Badge>
          </Item>
          <ItemSeparator />
          <Item variant="muted" size="sm">
            <ItemContent>
              <ItemTitle>Deployment Rate</ItemTitle>
              <ItemDescription>Subscriptions with live sites</ItemDescription>
            </ItemContent>
            <Badge variant="default">
              {liveRate.toFixed(0)}%
            </Badge>
          </Item>
          <ItemSeparator />
          <Item variant="muted" size="sm">
            <ItemContent>
              <ItemTitle>Average Sites</ItemTitle>
              <ItemDescription>Sites per active subscription</ItemDescription>
            </ItemContent>
            <Badge variant="secondary">
              {activeSubscriptions > 0
                ? (liveSites / activeSubscriptions).toFixed(1)
                : '0.0'}
            </Badge>
          </Item>
        </ItemGroup>
      </ItemContent>
    </Item>
  )
}
