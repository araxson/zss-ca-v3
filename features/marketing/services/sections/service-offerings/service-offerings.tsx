import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { serviceOfferingsData } from './service-offerings.data'

export function ServiceOfferings() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {serviceOfferingsData.heading}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl text-balance">
              We own the full lifecycle so you have one partner for everything web.
            </p>
          </div>
        </div>
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
