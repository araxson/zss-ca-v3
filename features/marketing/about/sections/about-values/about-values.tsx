import { Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { aboutValuesData } from './about-values.data'

export function AboutValues() {
  return (
    <section className="space-y-6">
      <SectionHeader title={aboutValuesData.title} align="center" />
      <div className="grid gap-4 md:grid-cols-2">
        {aboutValuesData.values.map((value) => (
          <Card key={value.title}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="mt-1 text-primary" aria-hidden="true">
                  <Check className="size-5" />
                </span>
                <div className="space-y-1">
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
