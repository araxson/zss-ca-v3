import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { homeProcessData } from './process.data'

export function HomeProcess() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title={homeProcessData.heading}
        description={homeProcessData.subheading}
        align="center"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {homeProcessData.steps.map((step) => (
          <Card key={step.id}>
            <CardHeader>
              <div className="space-y-2">
                <Badge variant="outline">{step.label}</Badge>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
