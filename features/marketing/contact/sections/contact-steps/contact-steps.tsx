import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
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
      <div className="grid gap-6 md:grid-cols-3">
        {contactStepsData.steps.map((step) => (
          <FieldSet key={step.id} className="space-y-3 rounded-lg border p-6">
            <FieldLabel asChild>
              <Badge variant="outline" className="w-fit">
                Step {step.id}
              </Badge>
            </FieldLabel>
            <FieldGroup className="space-y-2">
              <FieldLabel className="text-base font-semibold text-foreground">
                {step.title}
              </FieldLabel>
              <FieldDescription className="text-sm text-muted-foreground">
                {step.description}
              </FieldDescription>
            </FieldGroup>
          </FieldSet>
        ))}
      </div>
    </section>
  )
}
