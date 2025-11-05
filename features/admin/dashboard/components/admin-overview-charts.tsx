'use client'

import { TrendingUp, PieChart, LayoutDashboard } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
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

export function AdminOverviewCharts({ stats }: AdminOverviewChartsProps): React.JSX.Element {
  return (
    <Accordion type="multiple" defaultValue={["growth", "status"]} className="space-y-4">
      <AccordionItem value="growth">
        <AccordionTrigger className="text-left text-base font-semibold">
          <span className="flex items-center gap-2">
            <TrendingUp className="size-4" aria-hidden="true" />
            Growth & Subscriptions
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-4 md:grid-cols-2" role="list" aria-label="Growth and subscription charts">
            <GrowthTrendChart totalClients={stats.totalClients} activeSubscriptions={stats.activeSubscriptions} />
            <SubscriptionDistributionChart planDistribution={stats.planDistribution} />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="status">
        <AccordionTrigger className="text-left text-base font-semibold">
          <span className="flex items-center gap-2">
            <PieChart className="size-4" aria-hidden="true" />
            Site Status & Platform Metrics
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-4 md:grid-cols-2" role="list" aria-label="Site status and platform metrics charts">
            <SiteStatusChart statusDistribution={stats.statusDistribution} />
            <PlatformMetrics
              totalClients={stats.totalClients}
              activeSubscriptions={stats.activeSubscriptions}
              liveSites={stats.liveSites}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="platform">
        <AccordionTrigger className="text-left text-base font-semibold">
          <span className="flex items-center gap-2">
            <LayoutDashboard className="size-4" aria-hidden="true" />
            Platform Summary
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            <p>{stats.totalClients} clients • {stats.activeSubscriptions} active subscriptions • {stats.liveSites} live sites</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
