import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { resourcesCategoriesData } from './resources-categories.data'

export function ResourcesCategories() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-8">
        <SectionHeader title={resourcesCategoriesData.heading} align="center" />
        <div className="grid gap-4 md:grid-cols-3">
          {resourcesCategoriesData.categories.map((category) => (
            <Item
              key={category.id}
              variant="outline"
              asChild
              className="h-full flex-col items-start gap-4 rounded-xl bg-background/60 p-6 text-left"
            >
              <article aria-labelledby={`resource-category-${category.id}`}>
                <div className="flex items-start gap-3">
                  {category.icon ? (
                    <>
                      <ItemMedia variant="icon" aria-hidden="true">
                        <category.icon className="size-5" aria-hidden="true" />
                      </ItemMedia>
                      <span className="sr-only">{category.iconLabel}</span>
                    </>
                  ) : null}
                  <ItemContent className="gap-2">
                    {category.eyebrow ? (
                      <Badge variant="outline" className="w-fit">
                        {category.eyebrow}
                      </Badge>
                    ) : null}
                    <ItemTitle id={`resource-category-${category.id}`}>{category.name}</ItemTitle>
                    <ItemDescription className="line-clamp-none">
                      {category.description}
                    </ItemDescription>
                  </ItemContent>
                </div>
              </article>
            </Item>
          ))}
        </div>
      </section>
    </Item>
  )
}
