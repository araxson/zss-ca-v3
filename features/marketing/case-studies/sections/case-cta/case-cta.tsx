import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { caseCtaData } from './case-cta.data'

export function CaseCta() {
  return (
    <section className="space-y-6">
      <SectionHeader
        title={caseCtaData.heading}
        description={caseCtaData.description}
        align="center"
      />
      <Card>
        <CardContent>
          <div className="flex justify-center p-6">
            <ButtonGroup aria-label={caseCtaData.ariaLabel}>
              <Button asChild size="lg">
                <Link href={caseCtaData.primary.href}>{caseCtaData.primary.label}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={caseCtaData.secondary.href}>{caseCtaData.secondary.label}</Link>
              </Button>
            </ButtonGroup>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
