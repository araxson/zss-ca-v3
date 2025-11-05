import { Item } from '@/components/ui/item'
import { caseHeroData } from './case-hero.data'

export function CaseHero() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {caseHeroData.heading}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl text-balance">
              {caseHeroData.description}
            </p>
          </div>
        </div>
      </section>
    </Item>
  )
}
