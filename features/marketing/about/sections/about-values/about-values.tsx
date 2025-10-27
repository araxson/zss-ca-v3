import { Check } from 'lucide-react'
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { aboutValuesData } from './about-values.data'

export function AboutValues() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{aboutValuesData.title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {aboutValuesData.values.map((value) => (
          <FieldGroup key={value.title} className="flex items-start gap-3 rounded-lg border p-5">
            <Check className="mt-1 h-5 w-5 text-primary" aria-hidden />
            <div className="space-y-1">
              <FieldLabel className="text-base font-semibold text-foreground">
                {value.title}
              </FieldLabel>
              <FieldDescription className="text-sm text-muted-foreground">
                {value.description}
              </FieldDescription>
            </div>
          </FieldGroup>
        ))}
      </div>
    </section>
  )
}
