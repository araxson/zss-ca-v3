import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { aboutMissionData } from './about-mission.data'

export function AboutMission() {
  return (
    <Item variant="outline" className="max-w-3xl mx-auto border-none bg-transparent p-0">
      <ItemContent className="space-y-4 text-center">
        <ItemTitle className="text-3xl font-semibold">
          {aboutMissionData.title}
        </ItemTitle>
        <ItemDescription className="text-lg text-muted-foreground">
          {aboutMissionData.description}
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}
