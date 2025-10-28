import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { resourcesCtaData } from './resources-cta.data'

export function ResourcesCta() {
  return (
    <section className="space-y-6">
      <SectionHeader
        title={resourcesCtaData.heading}
        description={resourcesCtaData.description}
        align="center"
      />
      <Card>
        <CardContent>
          <div className="flex justify-center p-6">
            <ButtonGroup aria-label={resourcesCtaData.ariaLabel}>
              <Button asChild size="lg">
                <Link href={resourcesCtaData.primary.href}>{resourcesCtaData.primary.label}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={resourcesCtaData.secondary.href}>{resourcesCtaData.secondary.label}</Link>
              </Button>
            </ButtonGroup>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
