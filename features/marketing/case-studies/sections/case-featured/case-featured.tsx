import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { caseFeaturedData } from './case-featured.data'

export function CaseFeatured() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Featured engagement</h2>
        <p className="text-muted-foreground">
          {caseFeaturedData.client} · {caseFeaturedData.industry}
        </p>
      </div>
      <Item variant="outline" className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <ItemContent className="space-y-4 lg:w-1/2">
          <ItemTitle>Project snapshot</ItemTitle>
          <ItemDescription>{caseFeaturedData.summary}</ItemDescription>
          <ItemGroup className="grid gap-3 sm:grid-cols-3">
            {caseFeaturedData.metrics.map((metric) => (
              <Item
                key={metric.label}
                variant="muted"
                className="flex flex-col items-center gap-1 p-4 text-center sm:items-start sm:text-left"
              >
                <ItemTitle className="text-2xl font-semibold text-foreground">
                  {metric.value}
                </ItemTitle>
                <ItemDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                  {metric.label}
                </ItemDescription>
              </Item>
            ))}
          </ItemGroup>
        </ItemContent>
        <ItemContent className="space-y-3 lg:w-1/2">
          <ItemTitle>Client perspective</ItemTitle>
          <ItemDescription className="italic text-muted-foreground">
            “{caseFeaturedData.testimonial.quote}”
          </ItemDescription>
          <ItemDescription className="text-sm font-medium text-foreground">
            {caseFeaturedData.testimonial.author}
          </ItemDescription>
          <ItemDescription className="text-xs text-muted-foreground uppercase tracking-wide">
            {caseFeaturedData.testimonial.role}
          </ItemDescription>
        </ItemContent>
      </Item>
    </section>
  )
}
