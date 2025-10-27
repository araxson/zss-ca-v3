import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { resourcesHeroData } from './resources-hero.data'

export function ResourcesHero() {
  return (
    <section className="max-w-4xl mx-auto">
      <Item className="border-0 bg-transparent shadow-none flex flex-col items-center text-center">
        <ItemContent className="space-y-4 w-full">
          <ItemTitle className="text-4xl font-bold tracking-tight">
            {resourcesHeroData.heading}
          </ItemTitle>
          <ItemDescription className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {resourcesHeroData.description}
          </ItemDescription>
        </ItemContent>
      </Item>
    </section>
  )
}
