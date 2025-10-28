import { SectionHeader } from '@/features/shared/components'
import { aboutHeroData } from './about-hero.data'

export function AboutHero() {
  return (
    <section className="max-w-4xl mx-auto">
      <SectionHeader
        title={aboutHeroData.heading}
        description={aboutHeroData.subheading}
      />
    </section>
  )
}
