import { Item } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { aboutHeroData } from './about-hero.data'

export function AboutHero() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="max-w-4xl mx-auto">
        <SectionHeader
          title={aboutHeroData.heading}
          description={aboutHeroData.subheading}
        />
      </section>
    </Item>
  )
}
