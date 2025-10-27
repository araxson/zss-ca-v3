import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
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
          <FieldGroup className="grid gap-3 sm:grid-cols-3">
            {caseFeaturedData.metrics.map((metric) => (
              <div key={metric.label} className="space-y-1 text-center sm:text-left">
                <FieldLabel className="text-2xl font-semibold text-foreground">
                  {metric.value}
                </FieldLabel>
                <FieldDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                  {metric.label}
                </FieldDescription>
              </div>
            ))}
          </FieldGroup>
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
