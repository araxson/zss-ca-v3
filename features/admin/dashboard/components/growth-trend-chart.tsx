'use client'

import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
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
    <Item variant="outline" className="flex h-full flex-col">
      <ItemHeader className="gap-1">
        <ItemTitle>Growth Trend</ItemTitle>
        <ItemDescription>Client and subscription growth over time</ItemDescription>
      </ItemHeader>
      <ItemContent>
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
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSubscriptions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="clients"
                stroke="hsl(var(--chart-1))"
                fill="url(#colorClients)"
              />
              <Area
                type="monotone"
                dataKey="subscriptions"
                stroke="hsl(var(--chart-2))"
                fill="url(#colorSubscriptions)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ItemContent>
    </Item>
  )
}
