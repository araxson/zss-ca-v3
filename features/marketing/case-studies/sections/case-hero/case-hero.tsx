import { SectionHeader } from '@/features/shared/components'
import { caseHeroData } from './case-hero.data'

export function CaseHero() {
  return (
    <section className="max-w-4xl mx-auto">
      <SectionHeader
        title={caseHeroData.heading}
        description={caseHeroData.description}
      />
    </section>
  )
}
