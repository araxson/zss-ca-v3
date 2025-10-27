import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { serviceProcessData } from './service-process.data'

export function ServiceProcess() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{serviceProcessData.heading}</h2>
        <p className="text-muted-foreground">
          A structured roadmap keeps stakeholders aligned and launches predictable.
        </p>
      </div>
      <ItemGroup className="grid gap-4 md:grid-cols-3">
        {serviceProcessData.phases.map((phase) => (
          <Item key={phase.id} variant="outline" className="flex flex-col">
            <ItemContent className="space-y-3">
              <ItemTitle>Phase {phase.id}</ItemTitle>
              <ItemDescription className="text-base font-semibold text-foreground">
                {phase.title}
              </ItemDescription>
              <ItemDescription>{phase.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
