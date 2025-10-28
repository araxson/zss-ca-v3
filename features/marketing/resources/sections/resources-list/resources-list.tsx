import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { resourcesListData } from './resources-list.data'

export function ResourcesList() {
  return (
    <section className="space-y-8">
      <SectionHeader title={resourcesListData.heading} align="center" />
      <div className="grid gap-4 md:grid-cols-3">
        {resourcesListData.resources.map((resource) => (
          <Card key={resource.id}>
            <CardHeader>
              <CardTitle>{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">{resource.type}</Badge>
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-end">
                <Button asChild variant="outline" size="sm">
                  <Link
                    aria-label={resource.linkLabel ?? `Open ${resource.title}`}
                    href={resource.link}
                  >
                    {resource.linkLabel ?? 'View resource'}
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
