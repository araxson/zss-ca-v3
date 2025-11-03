import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { serviceProcessData } from './service-process.data'

export function ServiceProcess() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-8">
        <SectionHeader
          title={serviceProcessData.heading}
          description={serviceProcessData.subheading}
          align="center"
        />
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
