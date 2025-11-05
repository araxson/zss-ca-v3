import { resourcesHeroData } from './resources-hero.data'

export function ResourcesHero() {
  return (
    <section className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {resourcesHeroData.heading}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl text-balance">
            {resourcesHeroData.description}
          </p>
        </div>
      </div>
    </section>
  )
}
