import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { aboutValuesData } from './about-values.data'

export function AboutValues() {
  return (
    <section className="space-y-6">
      <SectionHeader title={aboutValuesData.title} align="center" />
      <div className="grid gap-4 md:grid-cols-2">
        {aboutValuesData.values.map((value) => (
          <Item
            key={value.title}
            variant="outline"
            asChild
            className="h-full flex-col items-start gap-4 rounded-xl bg-background/60 p-6 text-left"
          >
            <article aria-labelledby={`about-value-${value.title.replace(/\s+/g, '-').toLowerCase()}`}>
              <div className="flex items-start gap-3">
                {value.icon ? (
                  <>
                    <ItemMedia variant="icon" aria-hidden="true">
                      <value.icon className="size-5" aria-hidden="true" />
                    </ItemMedia>
                    <span className="sr-only">{value.iconLabel}</span>
                  </>
                ) : null}
                <ItemContent className="gap-2">
                  <ItemTitle id={`about-value-${value.title.replace(/\s+/g, '-').toLowerCase()}`}>
                    {value.title}
                  </ItemTitle>
                  <ItemDescription className="line-clamp-none">
                    {value.description}
                  </ItemDescription>
                </ItemContent>
              </div>
            </article>
          </Item>
        ))}
      </div>
    </section>
  )
}
