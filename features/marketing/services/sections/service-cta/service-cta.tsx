import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { serviceCtaData } from './service-cta.data'

export function ServiceCta() {
  return (
    <section className="space-y-6">
      <SectionHeader
        title={serviceCtaData.heading}
        description={serviceCtaData.description}
        align="center"
      />
      <Card>
        <CardContent>
          <div className="flex justify-center p-6">
            <ButtonGroup aria-label={serviceCtaData.ariaLabel}>
              <Button asChild size="lg">
                <Link href={serviceCtaData.primary.href}>{serviceCtaData.primary.label}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={serviceCtaData.secondary.href}>{serviceCtaData.secondary.label}</Link>
              </Button>
            </ButtonGroup>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
