import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { resourcesCtaData } from './resources-cta.data'

export function ResourcesCta() {
  return (
    <Item variant="outline" className="flex flex-col items-center gap-6 text-center">
      <ItemContent className="space-y-4 max-w-2xl">
        <ItemTitle className="text-3xl font-bold tracking-tight">
          {resourcesCtaData.heading}
        </ItemTitle>
        <ItemDescription className="text-lg text-muted-foreground">
          {resourcesCtaData.description}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href={resourcesCtaData.primary.href}>{resourcesCtaData.primary.label}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={resourcesCtaData.secondary.href}>{resourcesCtaData.secondary.label}</Link>
        </Button>
      </ItemActions>
    </Item>
  )
}
