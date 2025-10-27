import { Eye, Users, Target, TrendingUp } from 'lucide-react'
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { AnalyticsSummary } from '../api/queries'

interface AnalyticsSummaryCardsProps {
  summary: AnalyticsSummary
  days: number
}

export function AnalyticsSummaryCards({ summary, days }: AnalyticsSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Item variant="outline" className="flex h-full flex-col">
        <ItemContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <ItemTitle>Total Page Views</ItemTitle>
              <ItemDescription>Last {days} days</ItemDescription>
            </div>
            <ItemMedia>
              <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </ItemMedia>
          </div>
          <FieldGroup>
            <FieldLabel className="text-2xl font-bold">{summary.totalPageViews.toLocaleString()}</FieldLabel>
            <FieldDescription className="text-xs text-muted-foreground">
              Compared to prior period: +12%
            </FieldDescription>
          </FieldGroup>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex h-full flex-col">
        <ItemContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <ItemTitle>Unique Visitors</ItemTitle>
              <ItemDescription>Last {days} days</ItemDescription>
            </div>
            <ItemMedia>
              <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </ItemMedia>
          </div>
          <FieldGroup>
            <FieldLabel className="text-2xl font-bold">{summary.totalUniqueVisitors.toLocaleString()}</FieldLabel>
            <FieldDescription className="text-xs text-muted-foreground">
              Returning visitor rate: 38%
            </FieldDescription>
          </FieldGroup>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex h-full flex-col">
        <ItemContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <ItemTitle>Conversions</ItemTitle>
              <ItemDescription>Last {days} days</ItemDescription>
            </div>
            <ItemMedia>
              <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </ItemMedia>
          </div>
          <FieldGroup>
            <FieldLabel className="text-2xl font-bold">{summary.totalConversions.toLocaleString()}</FieldLabel>
            <FieldDescription className="text-xs text-muted-foreground">
              Conversion rate: 4.6%
            </FieldDescription>
          </FieldGroup>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex h-full flex-col">
        <ItemContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <ItemTitle>Avg. Daily Views</ItemTitle>
              <ItemDescription>Per day average</ItemDescription>
            </div>
            <ItemMedia>
              <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </ItemMedia>
          </div>
          <FieldGroup>
            <FieldLabel className="text-2xl font-bold">{summary.averagePageViews.toLocaleString()}</FieldLabel>
            <FieldDescription className="text-xs text-muted-foreground">
              Peak traffic on Wednesdays
            </FieldDescription>
          </FieldGroup>
        </ItemContent>
      </Item>
    </div>
  )
}
