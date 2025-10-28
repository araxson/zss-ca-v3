import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { heroData } from './hero.data'

export function Hero() {
  return (
    <section className="max-w-4xl mx-auto">
      <Item className="border-0 bg-transparent shadow-none flex flex-col items-center gap-6 text-center">
        <ItemContent className="space-y-4 w-full">
          <SectionHeader
            title={heroData.title}
            description={heroData.description}
            align="center"
            kicker={heroData.tagline}
            kickerVariant="badge"
          />
        </ItemContent>
        <ItemActions className="w-full justify-center">
          <ButtonGroup className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button asChild size="lg">
              <Link href={heroData.cta.primary.href}>
                {heroData.cta.primary.label}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={heroData.cta.secondary.href}>
                {heroData.cta.secondary.label}
              </Link>
            </Button>
          </ButtonGroup>
        </ItemActions>
      </Item>
    </section>
  )
}
