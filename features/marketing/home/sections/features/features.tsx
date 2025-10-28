import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { featuresData } from './features.data'

export function Features() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-12">
      <SectionHeader
        title={featuresData.heading}
        description={featuresData.subheading}
        align="center"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuresData.features.map((feature) => (
          <Card key={feature.id}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Badge aria-label={feature.iconLabel} variant="outline">
                  {feature.icon}
                </Badge>
                <div className="space-y-1">
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
