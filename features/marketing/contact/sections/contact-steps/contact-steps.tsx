import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { contactStepsData } from './contact-steps.data'

export function ContactSteps() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">{contactStepsData.heading}</h2>
        <p className="text-muted-foreground">
          Here&apos;s how we turn your idea into a live website.
        </p>
      </div>
      <ItemGroup className="grid gap-6 md:grid-cols-3">
        {contactStepsData.steps.map((step) => (
          <Item key={step.id} variant="outline" className="flex flex-col p-6">
            <ItemContent className="space-y-3">
              <Badge variant="outline" className="w-fit">
                Step {step.id}
              </Badge>
              <ItemTitle className="text-base font-semibold text-foreground">
                {step.title}
              </ItemTitle>
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
