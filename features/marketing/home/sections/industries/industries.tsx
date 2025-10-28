import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { homeIndustriesData } from './industries.data'

export function HomeIndustries() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title={homeIndustriesData.heading}
        description="We partner with Canadian organizations who rely on compelling storytelling and consistent lead flow."
        align="center"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {homeIndustriesData.industries.map((industry) => (
          <Card key={industry.id}>
            <CardHeader>
              <CardTitle>{industry.name}</CardTitle>
              <CardDescription>{industry.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
