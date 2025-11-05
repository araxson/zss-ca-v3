import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { serviceProcessData } from './service-process.data'

export function ServiceProcess() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {serviceProcessData.heading}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl text-balance">
              {serviceProcessData.subheading}
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {serviceProcessData.phases.map((phase) => (
            <Item
              key={phase.id}
              variant="outline"
              asChild
              className="h-full flex-col items-start gap-3 rounded-xl bg-background/60 p-6 text-left"
            >
              <article aria-labelledby={`service-phase-${phase.id}`}>
                <Badge variant="outline">{phase.label}</Badge>
                <ItemContent className="gap-2 pt-2">
                  <ItemTitle id={`service-phase-${phase.id}`}>{phase.title}</ItemTitle>
                  <ItemDescription className="line-clamp-none">
                    {phase.description}
                  </ItemDescription>
                </ItemContent>
              </article>
            </Item>
          ))}
        </div>
      </section>
    </Item>
  )
}
