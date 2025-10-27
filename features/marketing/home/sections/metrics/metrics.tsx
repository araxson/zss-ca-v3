import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { homeMetricsData } from './metrics.data'

export function HomeMetrics() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{homeMetricsData.heading}</h2>
      </div>
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
