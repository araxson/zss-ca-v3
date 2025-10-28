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
import { serviceCtaData } from './service-cta.data'

export function ServiceCta() {
  return (
    <section className="space-y-6">
      <SectionHeader
        title={serviceCtaData.heading}
        description={serviceCtaData.description}
        align="center"
      />
      <Item variant="outline" className="flex flex-col items-center gap-6 text-center">
        <ItemActions className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href={serviceCtaData.primary.href}>{serviceCtaData.primary.label}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={serviceCtaData.secondary.href}>{serviceCtaData.secondary.label}</Link>
        </Button>
        </ItemActions>
      </Item>
    </section>
  )
}
