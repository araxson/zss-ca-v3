import { Item } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { aboutMissionData } from './about-mission.data'

export function AboutMission() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="max-w-3xl mx-auto">
        <SectionHeader
          title={aboutMissionData.title}
          description={aboutMissionData.description}
          align="center"
        />
      </section>
    </Item>
  )
}
