import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { serviceProcessData } from './service-process.data'

export function ServiceProcess() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title={serviceProcessData.heading}
        description={serviceProcessData.subheading}
        align="center"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {serviceProcessData.phases.map((phase) => (
          <Card key={phase.id}>
            <CardHeader>
              <Badge variant="outline">{phase.label}</Badge>
              <CardTitle>{phase.title}</CardTitle>
              <CardDescription>{phase.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
