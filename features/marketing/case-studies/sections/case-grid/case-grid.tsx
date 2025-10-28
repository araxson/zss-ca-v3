import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { caseGridData } from './case-grid.data'

export function CaseGrid() {
  return (
    <section className="space-y-8">
      <SectionHeader title={caseGridData.heading} align="center" />
      <div className="grid gap-4 md:grid-cols-2">
        {caseGridData.cases.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.industry}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{item.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {item.services.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
