import { SectionHeader } from '@/features/shared/components'
import { serviceHeroData } from './service-hero.data'

export function ServiceHero() {
  return (
    <section className="max-w-4xl mx-auto">
      <SectionHeader
        title={serviceHeroData.heading}
        description={serviceHeroData.description}
      />
    </section>
  )
}
