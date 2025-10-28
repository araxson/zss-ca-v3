import { aboutMissionData } from './about-mission.data'
import { SectionHeader } from '@/features/shared/components'

export function AboutMission() {
  return (
    <section className="max-w-3xl mx-auto">
      <SectionHeader
        title={aboutMissionData.title}
        description={aboutMissionData.description}
        align="center"
      />
    </section>
  )
}
