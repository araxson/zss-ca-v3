import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { SectionHeader } from '@/features/shared/components'
import { heroData } from './hero.data'

export function Hero() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
      <SectionHeader
        title={heroData.title}
        description={heroData.description}
        align="center"
        kicker={heroData.tagline}
        kickerVariant="badge"
      />
      <div className="flex justify-center">
        <ButtonGroup aria-label={heroData.ctaAriaLabel}>
          <Button asChild size="lg">
            <Link href={heroData.cta.primary.href}>{heroData.cta.primary.label}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={heroData.cta.secondary.href}>{heroData.cta.secondary.label}</Link>
          </Button>
        </ButtonGroup>
      </div>
    </section>
  )
}
