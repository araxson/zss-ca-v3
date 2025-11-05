import { Badge } from '@/components/ui/badge'
import { Item } from '@/components/ui/item'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { contactStepsData } from './contact-steps.data'

export function ContactSteps() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {contactStepsData.heading}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl text-balance">
              Here&apos;s how we turn your idea into a live website.
            </p>
          </div>
        </div>
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
