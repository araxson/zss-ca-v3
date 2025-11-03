import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { caseGridData } from './case-grid.data'

export function CaseGrid() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-8">
        <SectionHeader title={caseGridData.heading} align="center" />
        <div className="grid gap-4 md:grid-cols-2">
          {caseGridData.cases.map((item) => (
            <Item
              key={item.id}
              variant="outline"
              asChild
              className="h-full flex-col items-start gap-4 rounded-xl bg-background/60 p-6 text-left"
            >
              <article aria-labelledby={`case-${item.id}-title`}>
                <div className="flex items-start gap-3">
                  {item.icon ? (
                    <>
                      <ItemMedia variant="icon" aria-hidden="true">
                        <item.icon className="size-5" aria-hidden="true" />
                      </ItemMedia>
                      <span className="sr-only">{item.iconLabel}</span>
                    </>
                  ) : null}
                  <ItemContent className="gap-2">
                    <ItemTitle id={`case-${item.id}-title`}>{item.name}</ItemTitle>
                    <Badge variant="outline" className="w-fit">
                      {item.industry}
                    </Badge>
                  </ItemContent>
                </div>
                <ItemDescription className="line-clamp-none text-sm text-muted-foreground">
                  {item.summary}
                </ItemDescription>
                <div className="flex flex-wrap gap-2 pt-2">
                  {item.services.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </article>
            </Item>
          ))}
        </div>
      </section>
    </Item>
  )
}
