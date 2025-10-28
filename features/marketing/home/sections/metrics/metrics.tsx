import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { homeMetricsData } from './metrics.data'

export function HomeMetrics() {
  return (
    <section className="space-y-6">
      <SectionHeader title={homeMetricsData.heading} align="center" />
      <div className="grid gap-4 md:grid-cols-3">
        {homeMetricsData.metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <div className="space-y-2 text-center">
                <Badge variant="outline">{metric.label}</Badge>
                <div className="text-4xl font-semibold tracking-tight">
                  {metric.value}
                </div>
                <CardDescription>{metric.helper}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
