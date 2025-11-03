'use client'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

interface SiteStatusChartProps {
  statusDistribution: Record<string, number>
}

export function SiteStatusChart({ statusDistribution }: SiteStatusChartProps) {
  const statusChartData = Object.entries(statusDistribution).map(([name, count]) => ({
    name,
    count,
  }))

  return (
    <Item variant="outline" aria-label="Site status distribution chart">
      <ItemHeader>
        <ItemTitle>Site Status Distribution</ItemTitle>
        <ItemDescription>Websites by deployment status</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {statusChartData.length > 0 ? (
          <ChartContainer
            config={{
              count: {
                label: 'Sites',
                color: 'hsl(var(--chart-3))',
              },
            }}
            className="min-h-[280px]"
          >
            <BarChart
              data={statusChartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--muted))' }} />
              <Bar
                dataKey="count"
                fill="hsl(var(--chart-3))"
                radius={[0, 4, 4, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <Empty className="min-h-[280px]">
            <EmptyHeader>
              <EmptyTitle>No site data</EmptyTitle>
              <EmptyDescription>No sites to display</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ItemContent>
    </Item>
  )
}
