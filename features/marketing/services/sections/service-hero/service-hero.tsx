import { serviceHeroData } from './service-hero.data'

export function ServiceHero() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">{serviceHeroData.heading}</h1>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        {serviceHeroData.description}
      </p>
    </section>
  )
}
