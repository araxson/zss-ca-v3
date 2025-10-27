import { Eye, Users, Target, TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import type { AnalyticsSummary } from '../api/queries'

interface AnalyticsSummaryCardsProps {
  summary: AnalyticsSummary
  days: number
}

export function AnalyticsSummaryCards({ summary, days }: AnalyticsSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Total Page Views</CardTitle>
            <CardDescription>Last {days} days</CardDescription>
          </div>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldLabel className="text-2xl font-bold">{summary.totalPageViews.toLocaleString()}</FieldLabel>
            <FieldDescription className="text-xs text-muted-foreground">
              Compared to prior period: +12%
            </FieldDescription>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Unique Visitors</CardTitle>
            <CardDescription>Last {days} days</CardDescription>
          </div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldLabel className="text-2xl font-bold">{summary.totalUniqueVisitors.toLocaleString()}</FieldLabel>
            <FieldDescription className="text-xs text-muted-foreground">
              Returning visitor rate: 38%
            </FieldDescription>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Conversions</CardTitle>
            <CardDescription>Last {days} days</CardDescription>
          </div>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldLabel className="text-2xl font-bold">{summary.totalConversions.toLocaleString()}</FieldLabel>
            <FieldDescription className="text-xs text-muted-foreground">
              Conversion rate: 4.6%
            </FieldDescription>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Avg. Daily Views</CardTitle>
            <CardDescription>Per day average</CardDescription>
          </div>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldLabel className="text-2xl font-bold">{summary.averagePageViews.toLocaleString()}</FieldLabel>
            <FieldDescription className="text-xs text-muted-foreground">
              Peak traffic on Wednesdays
            </FieldDescription>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
