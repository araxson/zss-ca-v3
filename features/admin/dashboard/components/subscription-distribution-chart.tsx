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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts'

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

interface SubscriptionDistributionChartProps {
  planDistribution: Record<string, number>
}

export function SubscriptionDistributionChart({ planDistribution }: SubscriptionDistributionChartProps) {
  const planChartData = Object.entries(planDistribution).map(([name, count]) => ({
    name,
    count,
  }))

  return (
    <Item variant="outline" className="flex h-full flex-col">
      <ItemHeader className="gap-1">
        <ItemTitle>Subscription Distribution</ItemTitle>
        <ItemDescription>Active subscriptions by plan</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {planChartData.length > 0 ? (
          <ChartContainer
            config={{
              count: {
                label: 'Subscriptions',
                color: 'hsl(var(--primary))',
              },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="count"
                >
                  {planChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <Empty className="h-64">
            <EmptyHeader>
              <EmptyTitle>No subscription data</EmptyTitle>
              <EmptyDescription>No active subscriptions to display</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ItemContent>
    </Item>
  )
}
