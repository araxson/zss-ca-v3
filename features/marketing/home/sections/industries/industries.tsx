import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { homeIndustriesData } from './industries.data'

export function HomeIndustries() {
  return (
    <ItemGroup className="mx-auto w-full max-w-7xl gap-16">
      <Item className="flex w-full flex-col items-center border-0 p-0 text-center">
        <ItemContent className="max-w-3xl items-center gap-3 text-center">
          <ItemTitle className="justify-center">
            <span className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {homeIndustriesData.heading}
            </span>
          </ItemTitle>
          <ItemDescription className="text-base text-muted-foreground sm:text-lg">
            We partner with Canadian organizations who rely on compelling storytelling and consistent
            lead flow.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item className="w-full flex-col">
        <div className="grid gap-4 sm:grid-cols-2">
          {homeIndustriesData.industries.map((industry) => (
            <Item
              key={industry.id}
              variant="outline"
              className="flex-col items-start gap-4 p-6"
              aria-labelledby={`industry-${industry.id}-title`}
            >
              <ItemMedia variant="icon" aria-hidden="true">
                <industry.icon className="size-5" aria-hidden="true" />
              </ItemMedia>
              <span className="sr-only">{industry.iconLabel}</span>
              <ItemContent className="gap-2">
                <ItemTitle id={`industry-${industry.id}-title`}>{industry.name}</ItemTitle>
                <ItemDescription>{industry.description}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      </Item>
    </ItemGroup>
  )
}
