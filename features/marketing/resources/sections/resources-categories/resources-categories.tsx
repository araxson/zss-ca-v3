import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { resourcesCategoriesData } from './resources-categories.data'

export function ResourcesCategories() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{resourcesCategoriesData.heading}</h2>
      </div>
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
