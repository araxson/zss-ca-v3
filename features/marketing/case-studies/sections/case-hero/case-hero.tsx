import { Item } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { caseHeroData } from './case-hero.data'

export function CaseHero() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="max-w-4xl mx-auto">
        <SectionHeader
          title={caseHeroData.heading}
          description={caseHeroData.description}
        />
      </section>
    </Item>
  )
}
