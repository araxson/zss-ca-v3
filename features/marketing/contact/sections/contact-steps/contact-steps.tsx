import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/features/shared/components'
import { contactStepsData } from './contact-steps.data'

export function ContactSteps() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title={contactStepsData.heading}
        description="Here&apos;s how we turn your idea into a live website."
        align="center"
      />
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
