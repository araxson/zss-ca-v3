import { Badge } from '@/components/ui/badge'
import { Item } from '@/components/ui/item'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { contactStepsData } from './contact-steps.data'

export function ContactSteps() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-8">
        <SectionHeader
          title={contactStepsData.heading}
          description="Here&apos;s how we turn your idea into a live website."
          align="center"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {contactStepsData.steps.map((step) => (
            <Card key={step.id}>
              <CardHeader>
                <div className="space-y-3">
                  <Badge variant="outline">{step.label}</Badge>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </Item>
  )
}
