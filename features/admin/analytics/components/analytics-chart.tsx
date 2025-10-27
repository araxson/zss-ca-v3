import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
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

export function AnalyticsChart({ analytics }: AnalyticsChartProps) {
  if (analytics.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Analytics Data</CardTitle>
          <CardDescription>No analytics data available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty className="h-48">
            <EmptyHeader>
              <EmptyTitle>No analytics data</EmptyTitle>
              <EmptyDescription>
                Start collecting data to see performance trends here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Daily Metrics</CardTitle>
        <CardDescription>
          Detailed breakdown of site performance over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 rounded-md border">
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Page Views</TableHead>
                <TableHead className="text-right">Unique Visitors</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {format(new Date(item.metric_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">{item.page_views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {item.unique_visitors.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{item.conversions.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
