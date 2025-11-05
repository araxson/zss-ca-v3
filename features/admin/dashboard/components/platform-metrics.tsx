'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface PlatformMetricsProps {
  totalClients: number
  activeSubscriptions: number
  liveSites: number
}

export function PlatformMetrics({ totalClients, activeSubscriptions, liveSites }: PlatformMetricsProps): React.JSX.Element {
  const subscriptionRate = totalClients > 0
    ? (activeSubscriptions / totalClients) * 100
    : 0

  const liveRate = activeSubscriptions > 0
    ? (liveSites / activeSubscriptions) * 100
    : 0

  return (
    <Item variant="outline" aria-label="Platform metrics summary">
      <Collapsible defaultOpen>
        <ItemHeader>
          <ItemTitle>Platform Metrics</ItemTitle>
          <ItemDescription>Key performance indicators</ItemDescription>
        </ItemHeader>
        <ItemActions>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className="size-4 transition-transform data-[state=open]:rotate-180" aria-hidden="true" />
              <span className="sr-only">Toggle platform metrics</span>
            </Button>
          </CollapsibleTrigger>
        </ItemActions>
        <ItemSeparator />
        <CollapsibleContent>
          <ItemContent>
            <ItemGroup>
              <Item variant="muted" size="sm">
                <ItemContent>
                  <ItemTitle>Conversion Rate</ItemTitle>
                  <ItemDescription>Clients to active subscriptions</ItemDescription>
                </ItemContent>
                <Badge variant="default">{subscriptionRate.toFixed(0)}%</Badge>
              </Item>
              <ItemSeparator />
              <Item variant="muted" size="sm">
                <ItemContent>
                  <ItemTitle>Deployment Rate</ItemTitle>
                  <ItemDescription>Subscriptions with live sites</ItemDescription>
                </ItemContent>
                <Badge variant="default">{liveRate.toFixed(0)}%</Badge>
              </Item>
              <ItemSeparator />
              <Item variant="muted" size="sm">
                <ItemContent>
                  <ItemTitle>Average Sites</ItemTitle>
                  <ItemDescription>Sites per active subscription</ItemDescription>
                </ItemContent>
                <Badge variant="secondary">
                  {activeSubscriptions > 0 ? (liveSites / activeSubscriptions).toFixed(1) : '0.0'}
                </Badge>
              </Item>
            </ItemGroup>
          </ItemContent>
        </CollapsibleContent>
      </Collapsible>
    </Item>
  )
}
