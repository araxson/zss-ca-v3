'use client'

import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'

interface DashboardSitesStatsProps {
  totalSites: number
  activeSitesCount: number
  sitesInProgressCount: number
}

export function DashboardSitesStats({
  totalSites,
  activeSitesCount,
  sitesInProgressCount,
}: DashboardSitesStatsProps) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>Sites Summary</ItemTitle>
        <ItemDescription>Quick overview of your website portfolio</ItemDescription>
      </ItemContent>
      <ItemContent className="space-y-3">
        <div className="flex items-center justify-between border-t pt-3">
          <div>
            <div className="font-medium">Total Sites</div>
            <div className="text-sm text-muted-foreground">All websites in your account</div>
          </div>
          <Badge variant="secondary">{totalSites}</Badge>
        </div>
        <div className="flex items-center justify-between border-t pt-3">
          <div>
            <div className="font-medium">Live Sites</div>
            <div className="text-sm text-muted-foreground">Currently deployed and accessible</div>
          </div>
          <Badge variant="default">{activeSitesCount}</Badge>
        </div>
        <div className="flex items-center justify-between border-t pt-3">
          <div>
            <div className="font-medium">In Progress</div>
            <div className="text-sm text-muted-foreground">Sites being developed</div>
          </div>
          <Badge variant="outline">{sitesInProgressCount}</Badge>
        </div>
      </ItemContent>
    </Item>
  )
}
