import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { featuresData } from './features.data'

export function Features() {
  return (
    <ItemGroup className="mx-auto w-full max-w-7xl gap-16">
      <Item className="flex w-full flex-col items-center border-0 p-0 text-center">
        <ItemContent className="max-w-3xl items-center gap-3 text-center">
          <ItemTitle className="justify-center">
            <span className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {featuresData.heading}
            </span>
          </ItemTitle>
          <ItemDescription className="text-base text-muted-foreground sm:text-lg">
            {featuresData.subheading}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item className="w-full flex-col">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuresData.features.map((feature) => (
            <Item
              key={feature.id}
              variant="outline"
              className="flex-col items-start gap-4 p-6"
              aria-labelledby={`feature-${feature.id}-title`}
            >
              <ItemMedia variant="icon" aria-hidden="true">
                <span aria-hidden role="img" className="text-lg">
                  {feature.icon}
                </span>
              </ItemMedia>
              <span className="sr-only">{feature.iconLabel}</span>
              <ItemContent className="gap-2">
                <ItemTitle id={`feature-${feature.id}-title`}>{feature.title}</ItemTitle>
                <ItemDescription>{feature.description}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      </Item>
    </ItemGroup>
  )
}
