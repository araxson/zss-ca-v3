import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { homeProcessData } from './process.data'

export function HomeProcess() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">{homeProcessData.heading}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {homeProcessData.subheading}
        </p>
      </div>
      <ItemGroup className="grid gap-4 md:grid-cols-3">
        {homeProcessData.steps.map((step) => (
          <Item key={step.id} variant="outline" className="flex flex-col p-6">
            <ItemContent className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Step {step.id}
              </p>
              <ItemTitle>{step.title}</ItemTitle>
              <ItemDescription className="text-sm text-muted-foreground">
                {step.description}
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
