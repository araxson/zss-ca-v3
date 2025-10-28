import { SectionHeader } from '@/features/shared/components'
import { resourcesHeroData } from './resources-hero.data'

export function ResourcesHero() {
  return (
    <section className="max-w-4xl mx-auto">
      <SectionHeader
        title={resourcesHeroData.heading}
        description={resourcesHeroData.description}
      />
    </section>
  )
}
