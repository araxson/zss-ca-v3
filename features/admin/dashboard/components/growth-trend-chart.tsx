'use client'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemHeader,
  ItemSeparator,
} from '@/components/ui/item'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts'

interface GrowthTrendChartProps {
  totalClients: number
  activeSubscriptions: number
}

export function GrowthTrendChart({ totalClients, activeSubscriptions }: GrowthTrendChartProps) {
  const trendData = [
    { month: 'May', clients: Math.max(0, totalClients - 25), subscriptions: Math.max(0, activeSubscriptions - 20) },
    { month: 'Jun', clients: Math.max(0, totalClients - 20), subscriptions: Math.max(0, activeSubscriptions - 16) },
    { month: 'Jul', clients: Math.max(0, totalClients - 15), subscriptions: Math.max(0, activeSubscriptions - 12) },
    { month: 'Aug', clients: Math.max(0, totalClients - 10), subscriptions: Math.max(0, activeSubscriptions - 8) },
    { month: 'Sep', clients: Math.max(0, totalClients - 5), subscriptions: Math.max(0, activeSubscriptions - 4) },
    { month: 'Oct', clients: totalClients, subscriptions: activeSubscriptions },
  ]

  return (
    <Item variant="outline" aria-label="Growth trends chart">
      <ItemHeader>
        <ItemTitle>Growth Trend</ItemTitle>
      </ItemHeader>

      <ItemSeparator />

      <ItemContent>
        <ItemDescription>Client and subscription growth over time</ItemDescription>
        <ChartContainer
          config={{
            clients: {
              label: 'Clients',
              color: 'hsl(var(--chart-1))',
            },
            subscriptions: {
              label: 'Subscriptions',
              color: 'hsl(var(--chart-2))',
            },
          }}
          className="min-h-[300px]"
        >
          <BarChart
            data={trendData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--muted))' }} />
            <Legend />
            <Bar
              dataKey="clients"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
            <Bar
              dataKey="subscriptions"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ChartContainer>
      </ItemContent>
    </Item>
  )
}
