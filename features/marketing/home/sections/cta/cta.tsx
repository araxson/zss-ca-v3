import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { SectionHeader } from '@/features/shared/components'
import { ctaData } from './cta.data'

export function Cta() {
  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <SectionHeader
        title={ctaData.heading}
        description={ctaData.description}
        align="center"
      />
      <div className="rounded-xl bg-primary px-8 py-10 text-center text-primary-foreground">
        <div className="flex justify-center">
          <ButtonGroup aria-label={ctaData.ariaLabel}>
            <Button asChild size="lg" variant="secondary">
              <Link href={ctaData.cta.primary.href}>{ctaData.cta.primary.label}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={ctaData.cta.secondary.href}>{ctaData.cta.secondary.label}</Link>
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </section>
  )
}
