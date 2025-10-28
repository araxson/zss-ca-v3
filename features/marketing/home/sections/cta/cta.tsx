import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { ctaData } from './cta.data'

export function Cta() {
  return (
    <section className="w-full max-w-4xl mx-auto space-y-6">
      <SectionHeader
        title={ctaData.heading}
        description={ctaData.description}
        align="center"
      />
      <Item
        variant="muted"
        className="bg-primary text-primary-foreground flex flex-col items-center gap-6 rounded-xl p-10 text-center"
      >
        <ItemActions className="w-full justify-center">
          <ButtonGroup className="w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-2">
            <Button asChild size="lg" variant="secondary">
              <Link href={ctaData.cta.primary.href}>
                {ctaData.cta.primary.label}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={ctaData.cta.secondary.href}>
                {ctaData.cta.secondary.label}
              </Link>
            </Button>
          </ButtonGroup>
        </ItemActions>
      </Item>
    </section>
  )
}
