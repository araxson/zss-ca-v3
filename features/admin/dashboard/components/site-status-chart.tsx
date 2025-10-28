'use client'

import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
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
    <Item variant="outline" className="flex h-full flex-col">
      <ItemHeader className="gap-1">
        <ItemTitle>Site Status Distribution</ItemTitle>
        <ItemDescription>Websites by deployment status</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {statusChartData.length > 0 ? (
          <ChartContainer
            config={{
              count: {
                label: 'Sites',
                color: 'hsl(var(--chart-2))',
              },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <ChartTooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <Empty className="h-64">
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
