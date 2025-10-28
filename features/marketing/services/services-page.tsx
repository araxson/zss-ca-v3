import { ServiceHero } from './sections/service-hero'
import { ServiceOfferings } from './sections/service-offerings'
import { ServiceProcess } from './sections/service-process'
import { ServiceCta } from './sections/service-cta'
import { SectionHeader } from '@/features/shared/components'

export function ServicesPage() {
  return (
    <div className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      <SectionHeader
        title="All-in-one website operations"
        description="Design, build, launch, and maintain your marketing site without adding headcount."
        align="center"
      />
      <ServiceHero />
      <ServiceOfferings />
      <ServiceProcess />
      <ServiceCta />
    </div>
  )
}
