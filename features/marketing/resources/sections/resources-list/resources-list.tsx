import Link from 'next/link'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { Badge } from '@/components/ui/badge'
import { resourcesListData } from './resources-list.data'

export function ResourcesList() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{resourcesListData.heading}</h2>
      </div>
      <ItemGroup className="grid gap-4 md:grid-cols-3">
        {resourcesListData.resources.map((resource) => (
          <Item key={resource.id} variant="outline" className="flex flex-col">
            <ItemContent className="space-y-3">
              <Badge variant="secondary" className="w-fit">
                {resource.type}
              </Badge>
              <ItemTitle>{resource.title}</ItemTitle>
              <ItemDescription>{resource.description}</ItemDescription>
            </ItemContent>
            <ItemActions className="justify-end">
              <Link href={resource.link} className="text-sm font-medium text-primary">
                View resource →
              </Link>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
