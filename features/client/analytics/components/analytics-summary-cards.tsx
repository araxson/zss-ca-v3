import { Eye, Users, Target, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { AnalyticsSummary } from '../api/queries'

interface AnalyticsSummaryCardsProps {
  summary: AnalyticsSummary
  days: number
}

export function AnalyticsSummaryCards({ summary, days }: AnalyticsSummaryCardsProps) {
  const metrics = [
    {
      title: 'Total Page Views',
      period: `Last ${days} days`,
      value: summary.totalPageViews,
      delta: 'Compared to prior period: +12%',
      icon: Eye,
    },
    {
      title: 'Unique Visitors',
      period: `Last ${days} days`,
      value: summary.totalUniqueVisitors,
      delta: 'Returning visitor rate: 38%',
      icon: Users,
    },
    {
      title: 'Conversions',
      period: `Last ${days} days`,
      value: summary.totalConversions,
      delta: 'Conversion rate: 4.6%',
      icon: Target,
    },
    {
      title: 'Avg. Daily Views',
      period: 'Per day average',
      value: summary.averagePageViews,
      delta: 'Peak traffic on Wednesdays',
      icon: TrendingUp,
    },
  ]

  return (
    <ItemGroup className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {metrics.map(({ title, period, value, delta, icon: Icon }) => (
        <Item
          key={title}
          variant="outline"
          aria-label={`${title} summary`}
        >
          <ItemMedia variant="icon">
            <Icon aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <ItemTitle>{title}</ItemTitle>
                  <ItemDescription>{period}</ItemDescription>
                </div>
                <Badge variant="secondary">{value.toLocaleString()}</Badge>
              </div>
              <ItemDescription>{delta}</ItemDescription>
            </div>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )
}
