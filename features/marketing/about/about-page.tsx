import { AboutHero } from './sections/about-hero'
import { AboutMission } from './sections/about-mission'
import { AboutServices } from './sections/about-services'
import { AboutValues } from './sections/about-values'
import { ItemGroup } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'

export function AboutPage() {
  return (
    <ItemGroup className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      <SectionHeader
        title="Meet your web partner"
        description="We build and steward high-performing marketing sites for Canadian service businesses."
        align="center"
      />
      <AboutHero />
      <AboutMission />
      <AboutServices />
      <AboutValues />
    </ItemGroup>
  )
}
