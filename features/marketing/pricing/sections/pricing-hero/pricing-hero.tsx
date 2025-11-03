import { Item } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { pricingHeroData } from './pricing-hero.data'

export function PricingHero() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="max-w-4xl mx-auto">
        <SectionHeader
          title={pricingHeroData.heading}
          description={pricingHeroData.description}
        />
      </section>
    </Item>
  )
}
