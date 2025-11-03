import { Badge } from '@/components/ui/badge'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { homeMetricsData } from './metrics.data'

export function HomeMetrics() {
  return (
    <ItemGroup className="mx-auto w-full max-w-7xl gap-16">
      <Item className="flex w-full flex-col items-center border-0 p-0 text-center">
        <ItemContent className="max-w-3xl items-center gap-3 text-center">
          <ItemTitle className="justify-center">
            <span className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {homeMetricsData.heading}
            </span>
          </ItemTitle>
        </ItemContent>
      </Item>
      <Item className="w-full flex-col">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {homeMetricsData.metrics.map((metric) => (
            <Item
              key={metric.label}
              variant="outline"
              className="flex-col items-center gap-4 p-6 text-center"
            >
              <Badge variant="outline">{metric.label}</Badge>
              <ItemContent className="items-center gap-2">
                <ItemTitle className="text-4xl font-semibold tracking-tight">
                  {metric.value}
                </ItemTitle>
                <ItemDescription className="text-sm text-muted-foreground">
                  {metric.helper}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      </Item>
    </ItemGroup>
  )
}
