import { Item } from '@/components/ui/item'
import { aboutMissionData } from './about-mission.data'

export function AboutMission() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {aboutMissionData.title}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl text-balance">
              {aboutMissionData.description}
            </p>
          </div>
        </div>
      </section>
    </Item>
  )
}
