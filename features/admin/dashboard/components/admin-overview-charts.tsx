'use client'

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
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2" aria-label="Growth and subscription charts">
        <GrowthTrendChart
          totalClients={stats.totalClients}
          activeSubscriptions={stats.activeSubscriptions}
        />
        <SubscriptionDistributionChart planDistribution={stats.planDistribution} />
      </div>

      <div className="grid gap-4 md:grid-cols-2" aria-label="Site status and platform metrics charts">
        <SiteStatusChart statusDistribution={stats.statusDistribution} />
        <PlatformMetrics
          totalClients={stats.totalClients}
          activeSubscriptions={stats.activeSubscriptions}
          liveSites={stats.liveSites}
        />
      </div>
    </div>
  )
}
