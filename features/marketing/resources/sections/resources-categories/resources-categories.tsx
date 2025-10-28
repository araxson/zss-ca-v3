import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { resourcesCategoriesData } from './resources-categories.data'

export function ResourcesCategories() {
  return (
    <section className="space-y-8">
      <SectionHeader title={resourcesCategoriesData.heading} align="center" />
      <div className="grid gap-4 md:grid-cols-3">
        {resourcesCategoriesData.categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="space-y-2">
                {category.eyebrow ? <Badge variant="outline">{category.eyebrow}</Badge> : null}
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
