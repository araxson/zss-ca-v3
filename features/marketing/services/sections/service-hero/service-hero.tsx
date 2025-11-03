import { Item } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { serviceHeroData } from './service-hero.data'

export function ServiceHero() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="max-w-4xl mx-auto">
        <SectionHeader
          title={serviceHeroData.heading}
          description={serviceHeroData.description}
        />
      </section>
    </Item>
  )
}
