import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { homeMetricsData } from './metrics.data'

export function HomeMetrics() {
  return (
    <section className="space-y-6">
      <SectionHeader title={homeMetricsData.heading} align="center" className="mb-2" />
      <ItemGroup className="grid gap-4 md:grid-cols-3">
        {homeMetricsData.metrics.map((metric) => (
          <Item key={metric.label} variant="outline" className="flex flex-col">
            <ItemContent className="space-y-2 text-center">
              <ItemTitle className="text-4xl font-semibold tracking-tight">
                {metric.value}
              </ItemTitle>
              <ItemDescription className="text-sm font-medium uppercase tracking-wide text-primary/80">
                {metric.label}
              </ItemDescription>
              <ItemDescription>{metric.helper}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
