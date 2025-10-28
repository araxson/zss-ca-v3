import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { serviceOfferingsData } from './service-offerings.data'

export function ServiceOfferings() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title={serviceOfferingsData.heading}
        description="We own the full lifecycle so you have one partner for everything web."
        align="center"
      />
      <ItemGroup className="grid gap-4 md:grid-cols-3">
        {serviceOfferingsData.cards.map((card) => (
          <Item key={card.id} variant="outline" className="flex flex-col">
            <ItemContent className="space-y-3">
              <ItemTitle>{card.title}</ItemTitle>
              <ItemDescription>{card.summary}</ItemDescription>
              <ItemGroup className="space-y-2">
                {card.features.map((feature) => (
                  <Item
                    key={feature.title}
                    variant="muted"
                    size="sm"
                    className="flex flex-col gap-1 p-3"
                  >
                    <ItemTitle className="text-sm font-semibold text-foreground">
                      {feature.title}
                    </ItemTitle>
                    <ItemDescription className="text-sm text-muted-foreground">
                      {feature.description}
                    </ItemDescription>
                  </Item>
                ))}
              </ItemGroup>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
