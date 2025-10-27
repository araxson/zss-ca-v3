import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { serviceOfferingsData } from './service-offerings.data'

export function ServiceOfferings() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">{serviceOfferingsData.heading}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We own the full lifecycle so you have one partner for everything web.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {serviceOfferingsData.cards.map((card) => (
          <Item key={card.id} variant="outline" className="flex flex-col">
            <ItemContent className="space-y-3">
              <ItemTitle>{card.title}</ItemTitle>
              <ItemDescription>{card.summary}</ItemDescription>
              <FieldGroup className="space-y-2">
                {card.features.map((feature) => (
                  <div key={feature.title} className="space-y-1">
                    <FieldLabel className="text-sm font-semibold text-foreground">
                      {feature.title}
                    </FieldLabel>
                    <FieldDescription className="text-sm text-muted-foreground">
                      {feature.description}
                    </FieldDescription>
                  </div>
                ))}
              </FieldGroup>
            </ItemContent>
          </Item>
        ))}
      </div>
    </section>
  )
}
