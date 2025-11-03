import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { caseFeaturedData } from './case-featured.data'

export function CaseFeatured() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-6">
        <SectionHeader
          title={caseFeaturedData.client}
          description={caseFeaturedData.industry}
          align="center"
        />
        <Item
          variant="outline"
          asChild
          className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-background/60 p-6 lg:flex-row lg:items-stretch"
        >
          <article aria-labelledby="case-featured-snapshot">
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex flex-col gap-4 lg:w-1/2">
                <ItemTitle id="case-featured-snapshot" className="text-base font-semibold">
                  Project snapshot
                </ItemTitle>
                <ItemDescription className="line-clamp-none text-sm text-muted-foreground">
                  {caseFeaturedData.summary}
                </ItemDescription>
                <ItemGroup className="gap-3 sm:grid sm:grid-cols-3" aria-label="Project impact metrics">
                  {caseFeaturedData.metrics.map((metric) => (
                    <Item
                      key={metric.label}
                      variant="muted"
                      className="flex-col items-center gap-2 rounded-lg bg-muted/40 p-4 text-center"
                    >
                      <ItemTitle className="text-2xl font-semibold text-foreground">{metric.value}</ItemTitle>
                      <ItemContent className="items-center">
                        <Badge variant="outline">{metric.label}</Badge>
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              </div>
              <div className="space-y-3 lg:w-1/2">
                <ItemTitle className="text-base font-semibold text-foreground">Client perspective</ItemTitle>
                <ItemDescription className="line-clamp-none italic text-muted-foreground">
                  {caseFeaturedData.testimonial.quote}
                </ItemDescription>
                <p className="text-sm font-medium text-foreground">{caseFeaturedData.testimonial.author}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {caseFeaturedData.testimonial.role}
                </p>
              </div>
            </div>
          </article>
        </Item>
      </section>
    </Item>
  )
}
