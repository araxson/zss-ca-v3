import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { caseFeaturedData } from './case-featured.data'

export function CaseFeatured() {
  return (
    <section className="space-y-6">
      <SectionHeader
        title={caseFeaturedData.client}
        description={caseFeaturedData.industry}
        align="center"
      />
      <Card>
        <CardContent>
          <div className="flex flex-col gap-6 p-6 lg:flex-row">
            <div className="space-y-4 lg:w-1/2">
              <h3 className="text-base font-semibold text-foreground">Project snapshot</h3>
              <p className="text-sm text-muted-foreground">{caseFeaturedData.summary}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {caseFeaturedData.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-md border bg-muted/40 p-3 text-center">
                    <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                    <div className="mt-2 flex justify-center">
                      <Badge variant="outline">{metric.label}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 lg:w-1/2">
              <h3 className="text-base font-semibold text-foreground">Client perspective</h3>
              <p className="italic text-muted-foreground">{caseFeaturedData.testimonial.quote}</p>
              <p className="text-sm font-medium text-foreground">{caseFeaturedData.testimonial.author}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {caseFeaturedData.testimonial.role}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
