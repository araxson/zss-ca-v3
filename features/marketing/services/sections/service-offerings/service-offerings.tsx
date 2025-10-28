import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      <div className="grid gap-4 md:grid-cols-3">
        {serviceOfferingsData.cards.map((card) => (
          <Card key={card.id}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{card.summary}</p>
                <div className="space-y-2">
                  {card.features.map((feature) => (
                    <div key={feature.title} className="rounded-md border bg-muted/40 p-3">
                      <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
