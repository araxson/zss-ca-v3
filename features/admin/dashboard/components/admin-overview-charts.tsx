'use client'

import { ItemGroup } from '@/components/ui/item'
import { GrowthTrendChart } from './growth-trend-chart'
import { SubscriptionDistributionChart } from './subscription-distribution-chart'
import { SiteStatusChart } from './site-status-chart'
import { PlatformMetrics } from './platform-metrics'

interface AdminOverviewChartsProps {
  stats: {
    totalClients: number
    activeSubscriptions: number
    liveSites: number
    planDistribution: Record<string, number>
    statusDistribution: Record<string, number>
  }
}

export function AdminOverviewCharts({ stats }: AdminOverviewChartsProps) {
  return (
    <>
      <ItemGroup className="grid gap-4 md:grid-cols-2">
        <GrowthTrendChart
          totalClients={stats.totalClients}
          activeSubscriptions={stats.activeSubscriptions}
        />
        <SubscriptionDistributionChart planDistribution={stats.planDistribution} />
      </ItemGroup>

      <ItemGroup className="grid gap-4 md:grid-cols-2">
        <SiteStatusChart statusDistribution={stats.statusDistribution} />
        <PlatformMetrics
          totalClients={stats.totalClients}
          activeSubscriptions={stats.activeSubscriptions}
          liveSites={stats.liveSites}
        />
      </ItemGroup>
    </>
  )
}
