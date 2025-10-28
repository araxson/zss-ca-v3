import { format } from 'date-fns'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
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
      <Item variant="outline" className="h-full flex flex-col">
        <ItemHeader>
          <ItemTitle>Analytics Data</ItemTitle>
          <ItemDescription>No analytics data available yet</ItemDescription>
        </ItemHeader>
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
    <Item variant="outline" className="h-full flex flex-col">
      <ItemHeader>
        <ItemTitle>Daily Metrics</ItemTitle>
        <ItemDescription>
          Detailed breakdown of site performance over time
        </ItemDescription>
      </ItemHeader>
      <ItemContent>
        <ScrollArea className="h-96 rounded-md border">
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
        <Item className="mt-4 flex items-center justify-between border-0 px-0">
          <ItemTitle className="text-sm font-medium text-muted-foreground">
            Totals
          </ItemTitle>
          <ItemActions className="gap-2">
            <span className="text-xs text-muted-foreground">
              Page Views: {totals.pageViews.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Unique Visitors: {totals.uniqueVisitors.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Conversions: {totals.conversions.toLocaleString()}
            </span>
          </ItemActions>
        </Item>
      </ItemContent>
    </Item>
  )
}
