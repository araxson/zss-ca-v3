import { Item } from '@/components/ui/item'
import { aboutHeroData } from './about-hero.data'

export function AboutHero() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {aboutHeroData.heading}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl text-balance">
              {aboutHeroData.subheading}
            </p>
          </div>
        </div>
      </section>
    </Item>
  )
}
