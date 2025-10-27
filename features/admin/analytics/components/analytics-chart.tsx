import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
          <div className="text-sm text-muted-foreground">
            Start collecting data to see performance trends here.
          </div>
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
        <Table>
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
      </CardContent>
    </Card>
  )
}
