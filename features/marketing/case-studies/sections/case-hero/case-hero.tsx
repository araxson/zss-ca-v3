import { caseHeroData } from './case-hero.data'

export function CaseHero() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">{caseHeroData.heading}</h1>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        {caseHeroData.description}
      </p>
    </section>
  )
}
