'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
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
    <Card aria-label="Site status distribution chart">
      <CardHeader>
        <CardTitle>Site Status Distribution</CardTitle>
        <CardDescription>Websites by deployment status</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
