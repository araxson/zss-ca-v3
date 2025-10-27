import { resourcesHeroData } from './resources-hero.data'

export function ResourcesHero() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">{resourcesHeroData.heading}</h1>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        {resourcesHeroData.description}
      </p>
    </section>
  )
}
