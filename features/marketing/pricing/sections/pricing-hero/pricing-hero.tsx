import { pricingHeroData } from './pricing-hero.data'

export function PricingHero() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">{pricingHeroData.heading}</h1>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        {pricingHeroData.description}
      </p>
    </section>
  )
}
