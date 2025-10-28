import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { resourcesCategoriesData } from './resources-categories.data'

export function ResourcesCategories() {
  return (
    <section className="space-y-6">
      <SectionHeader title={resourcesCategoriesData.heading} align="center" />
      <ItemGroup className="grid gap-4 md:grid-cols-3">
        {resourcesCategoriesData.categories.map((category) => (
          <Item key={category.id} variant="outline" className="flex flex-col">
            <ItemContent className="space-y-2">
              <ItemTitle>{category.name}</ItemTitle>
              <ItemDescription>{category.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
