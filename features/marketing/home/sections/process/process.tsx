import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
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
      <div className="grid gap-4 md:grid-cols-3">
        {homeProcessData.steps.map((step) => (
          <FieldSet key={step.id} className="space-y-3 rounded-lg border p-6">
            <FieldLabel className="text-sm font-semibold text-primary uppercase tracking-wide">
              Step {step.id}
            </FieldLabel>
            <FieldGroup className="space-y-2">
              <FieldLabel className="text-lg font-semibold text-foreground">
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
