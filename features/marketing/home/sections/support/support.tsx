import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { homeSupportData } from './support.data'

export function HomeSupport() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title={homeSupportData.heading}
        description={homeSupportData.subheading}
        align="center"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {homeSupportData.highlights.map((highlight) => (
          <Card key={highlight.title}>
            <CardHeader>
              <div className="space-y-2">
                {highlight.eyebrow ? <Badge variant="outline">{highlight.eyebrow}</Badge> : null}
                <CardTitle>{highlight.title}</CardTitle>
                <CardDescription>{highlight.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Button asChild size="lg">
          <Link
            aria-label={homeSupportData.cta.ariaLabel}
            href={homeSupportData.cta.href}
          >
            {homeSupportData.cta.label}
          </Link>
        </Button>
      </div>
    </section>
  )
}
