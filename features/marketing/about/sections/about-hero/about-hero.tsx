import { aboutHeroData } from './about-hero.data'

export function AboutHero() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">{aboutHeroData.heading}</h1>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        {aboutHeroData.subheading}
      </p>
    </section>
  )
}
