'use client'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts'

interface DashboardSitesChartProps {
  chartData: Array<{ name: string; count: number }>
}

export function DashboardSitesChart({ chartData }: DashboardSitesChartProps): React.JSX.Element {
  if (chartData.length === 0) {
    return (
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>Site Status Overview</ItemTitle>
          <ItemDescription>Distribution of your websites by status</ItemDescription>
        </ItemHeader>
        <ItemContent>
          <Empty className="h-52">
            <EmptyHeader>
              <EmptyTitle>No site data</EmptyTitle>
              <EmptyDescription>Deploy a website to view status insights.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </ItemContent>
      </Item>
    )
  }

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Site Status Overview</ItemTitle>
        <ItemDescription>Distribution of your websites by status</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <ChartContainer
          config={{
            count: {
              label: 'Sites',
              color: 'var(--chart-1)',
            },
          }}
          className="min-h-[280px]"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--muted)' }} />
            <Bar
              dataKey="count"
              fill="var(--chart-1)"
              radius={[0, 4, 4, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ChartContainer>
      </ItemContent>
    </Item>
  )
}
