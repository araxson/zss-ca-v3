import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { resourcesListData } from './resources-list.data'

export function ResourcesList() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-8">
        <SectionHeader title={resourcesListData.heading} align="center" />
        <div className="grid gap-4 md:grid-cols-3">
          {resourcesListData.resources.map((resource) => (
            <Item
              key={resource.id}
              variant="outline"
              asChild
              className="h-full flex-col items-start gap-4 rounded-xl bg-background/60 p-6 text-left"
            >
              <article aria-labelledby={`resource-${resource.id}-title`}>
                <div className="flex items-start gap-3">
                  {resource.icon ? (
                    <>
                      <ItemMedia variant="icon" aria-hidden="true">
                        <resource.icon className="size-5" aria-hidden="true" />
                      </ItemMedia>
                      <span className="sr-only">{resource.iconLabel}</span>
                    </>
                  ) : null}
                  <ItemContent className="gap-2">
                    <ItemTitle id={`resource-${resource.id}-title`}>{resource.title}</ItemTitle>
                    <ItemDescription className="line-clamp-none">
                      {resource.description}
                    </ItemDescription>
                    <Badge variant="outline" className="w-fit">
                      {resource.type}
                    </Badge>
                  </ItemContent>
                </div>
                <ItemActions className="justify-end pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link
                      aria-label={resource.linkLabel ?? `Open ${resource.title}`}
                      href={resource.link}
                    >
                      {resource.linkLabel ?? 'View resource'}
                    </Link>
                  </Button>
                </ItemActions>
              </article>
            </Item>
          ))}
        </div>
      </section>
    </Item>
  )
}
