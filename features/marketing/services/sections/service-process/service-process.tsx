import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { serviceProcessData } from './service-process.data'

export function ServiceProcess() {
  return (
    <section className="space-y-6">
      <SectionHeader
        title={serviceProcessData.heading}
        description="A structured roadmap keeps stakeholders aligned and launches predictable."
        align="center"
      />
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
