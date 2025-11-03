import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { serviceOfferingsData } from './service-offerings.data'

export function ServiceOfferings() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-8">
        <SectionHeader
          title={serviceOfferingsData.heading}
          description="We own the full lifecycle so you have one partner for everything web."
          align="center"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {serviceOfferingsData.cards.map((card) => (
            <Item
              key={card.id}
              variant="outline"
              asChild
              className="h-full flex-col gap-4 rounded-xl bg-background/60 p-6 text-left"
            >
              <article aria-labelledby={`service-offering-${card.id}`}>
                <ItemHeader className="items-start gap-3">
                  {card.icon ? (
                    <>
                      <ItemMedia variant="icon" aria-hidden="true">
                        <card.icon className="size-5" aria-hidden="true" />
                      </ItemMedia>
                      <span className="sr-only">{card.iconLabel}</span>
                    </>
                  ) : null}
                  <ItemTitle id={`service-offering-${card.id}`}>{card.title}</ItemTitle>
                </ItemHeader>
                <ItemContent className="gap-3">
                  <p className="text-sm text-muted-foreground">{card.summary}</p>
                  <ItemGroup className="gap-2">
                    {card.features.map((feature) => (
                      <Item
                        key={feature.title}
                        variant="muted"
                        className="items-start gap-3 rounded-lg border border-border/50 bg-muted/40 p-3"
                      >
                        <ItemContent className="gap-1">
                          <ItemTitle className="text-sm font-semibold text-foreground">
                            {feature.title}
                          </ItemTitle>
                          <ItemDescription className="line-clamp-none text-sm text-muted-foreground">
                            {feature.description}
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                    ))}
                  </ItemGroup>
                </ItemContent>
              </article>
            </Item>
          ))}
        </div>
      </section>
    </Item>
  )
}
