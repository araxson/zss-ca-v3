import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { homeIndustriesData } from './industries.data'

export function HomeIndustries() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title={homeIndustriesData.heading}
        description="We partner with Canadian organizations who rely on compelling storytelling and consistent lead flow."
        align="center"
      />
      <ItemGroup className="grid gap-4 md:grid-cols-2">
        {homeIndustriesData.industries.map((industry) => (
          <Item key={industry.id} variant="outline" className="flex flex-col">
            <ItemContent className="space-y-2">
              <ItemTitle>{industry.name}</ItemTitle>
              <ItemDescription>{industry.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
