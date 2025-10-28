import { format } from 'date-fns'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  const totals = analytics.reduce(
    (acc, item) => {
      acc.pageViews += item.page_views
      acc.uniqueVisitors += item.unique_visitors
      acc.conversions += item.conversions
      return acc
    },
    { pageViews: 0, uniqueVisitors: 0, conversions: 0 }
  )

  if (analytics.length === 0) {
    return (
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Analytics Data</ItemTitle>
          <ItemDescription>No analytics data available yet</ItemDescription>
        </ItemContent>
        <ItemContent>
          <Empty className="h-48">
            <EmptyHeader>
              <EmptyTitle>No analytics data</EmptyTitle>
              <EmptyDescription>
                Start collecting data to see performance trends here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </ItemContent>
      </Item>
    )
  }

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>Daily Metrics</ItemTitle>
        <ItemDescription>
          Detailed breakdown of site performance over time
        </ItemDescription>
      </ItemContent>
      <ItemContent>
        <ScrollArea className="h-96 rounded-md border" aria-label="Daily analytics metrics table">
          <Table className="min-w-[500px]">
            <TableCaption>Daily engagement metrics for client sites.</TableCaption>
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
        <div className="mt-4 flex items-center justify-between text-muted-foreground">
          <span className="text-sm font-medium">Totals</span>
          <div className="flex gap-4">
            <span className="text-xs text-muted-foreground">
              Page Views: {totals.pageViews.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Unique Visitors: {totals.uniqueVisitors.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Conversions: {totals.conversions.toLocaleString()}
            </span>
          </div>
        </div>
      </ItemContent>
    </Item>
  )
}
