import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { resourcesCtaData } from './resources-cta.data'

export function ResourcesCta() {
  return (
    <section className="space-y-6">
      <SectionHeader
        title={resourcesCtaData.heading}
        description={resourcesCtaData.description}
        align="center"
      />
      <Item variant="outline" className="flex flex-col items-center gap-6 text-center">
        <ItemActions className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href={resourcesCtaData.primary.href}>{resourcesCtaData.primary.label}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={resourcesCtaData.secondary.href}>{resourcesCtaData.secondary.label}</Link>
        </Button>
        </ItemActions>
      </Item>
    </section>
  )
}
