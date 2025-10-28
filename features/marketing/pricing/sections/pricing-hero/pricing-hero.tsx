import { SectionHeader } from '@/features/shared/components'
import { pricingHeroData } from './pricing-hero.data'

export function PricingHero() {
  return (
    <section className="max-w-4xl mx-auto">
      <SectionHeader
        title={pricingHeroData.heading}
        description={pricingHeroData.description}
      />
    </section>
  )
}
