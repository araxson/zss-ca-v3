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
    <ItemGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map(({ title, period, value, delta, icon: Icon }) => (
        <Item
          key={title}
          variant="outline"
          aria-label={`${title} summary`}
        >
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
            <ItemDescription>{period}</ItemDescription>
          </ItemContent>
          <ItemMedia variant="icon">
            <Icon aria-hidden="true" />
          </ItemMedia>
          <FieldGroup className="mt-3">
            <FieldLabel className="text-2xl font-bold">{value.toLocaleString()}</FieldLabel>
            <FieldDescription>{delta}</FieldDescription>
          </FieldGroup>
        </Item>
      ))}
    </ItemGroup>
  )
}
