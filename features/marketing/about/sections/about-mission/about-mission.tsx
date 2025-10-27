import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { aboutMissionData } from './about-mission.data'

export function AboutMission() {
  return (
    <Item variant="outline" className="max-w-3xl mx-auto border-none bg-transparent p-6">
      <ItemHeader className="text-center">
        <ItemTitle className="text-3xl font-semibold">
          {aboutMissionData.title}
        </ItemTitle>
        <ItemDescription className="text-lg text-muted-foreground">
          {aboutMissionData.description}
        </ItemDescription>
      </ItemHeader>
      <ItemContent />
    </Item>
  )
}
