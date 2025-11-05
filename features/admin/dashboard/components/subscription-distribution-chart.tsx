'use client'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemSeparator,
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
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

interface SubscriptionDistributionChartProps {
  planDistribution: Record<string, number>
}

export function SubscriptionDistributionChart({ planDistribution }: SubscriptionDistributionChartProps): React.JSX.Element {
  const planChartData = Object.entries(planDistribution).map(([name, count]) => ({
    name,
    count,
  }))

  return (
    <Item variant="outline" aria-label="Subscription distribution chart">
      <ItemHeader>
        <ItemTitle>Subscription Distribution</ItemTitle>
        <ItemDescription>Active subscriptions by plan</ItemDescription>
      </ItemHeader>
      <ItemSeparator />
      <ItemContent>
        {planChartData.length > 0 ? (
          <ChartContainer
            config={{
              count: {
                label: 'Subscriptions',
                color: 'var(--chart-2)',
              },
            }}
            className="min-h-[280px]"
          >
            <BarChart
              accessibilityLayer
              data={planChartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--muted)' }} />
              <Bar
                dataKey="count"
                fill="var(--chart-2)"
                radius={[0, 4, 4, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <Empty className="min-h-[280px]">
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
