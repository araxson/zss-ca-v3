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
import { Cell, Pie, PieChart } from 'recharts'

interface DashboardSitesChartProps {
  chartData: Array<{ name: string; count: number }>
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function DashboardSitesChart({ chartData }: DashboardSitesChartProps) {
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
              color: 'hsl(var(--chart-1))',
            },
          }}
          className="min-h-[200px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}
              outerRadius={80}
              fill="hsl(var(--chart-1))"
              dataKey="count"
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </ItemContent>
    </Item>
  )
}
