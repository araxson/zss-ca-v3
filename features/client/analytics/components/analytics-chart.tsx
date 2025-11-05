'use client'

import { format } from 'date-fns'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import type { SiteAnalytics } from '../api/queries'

interface AnalyticsChartProps {
  analytics: SiteAnalytics[]
}

export function AnalyticsChart({ analytics }: AnalyticsChartProps): React.JSX.Element {
  const chartData = analytics.map((item) => ({
    date: format(new Date(item.metric_date), 'MMM d'),
    pageViews: item.page_views,
    visitors: item.unique_visitors,
    conversions: item.conversions,
  }))

  if (analytics.length === 0) {
    return (
      <div className="rounded-lg border p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Analytics Data</h3>
          <p className="text-sm text-muted-foreground">No analytics data available yet</p>
        </div>
        <Empty className="min-h-[300px]">
          <EmptyHeader>
            <EmptyTitle>No analytics data</EmptyTitle>
            <EmptyDescription>
              Start collecting data to see performance trends here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="rounded-lg border p-6 space-y-4" aria-label="Site analytics chart">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Daily Metrics</h3>
        <p className="text-sm text-muted-foreground">
          Detailed breakdown of site performance over time
        </p>
      </div>
      <ChartContainer
        config={{
          pageViews: {
            label: 'Page Views',
            color: 'var(--chart-1)',
          },
          visitors: {
            label: 'Unique Visitors',
            color: 'var(--chart-2)',
          },
          conversions: {
            label: 'Conversions',
            color: 'var(--chart-3)',
          },
        }}
        className="min-h-[350px]"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--muted)' }} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="pageViews"
            fill="var(--chart-1)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="visitors"
            fill="var(--chart-2)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="conversions"
            fill="var(--chart-3)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
