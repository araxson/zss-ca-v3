import { Hero } from './sections/hero'
import { HomeMetrics } from './sections/metrics'
import { Features } from './sections/features'
import { HomeProcess } from './sections/process'
import { HomeIndustries } from './sections/industries'
import { PricingPreview } from './sections/pricing-preview'
import { HomeSupport } from './sections/support'
import { Testimonials } from './sections/testimonials'
import { Faq } from './sections/faq'
import { Cta } from './sections/cta'
import { ItemGroup } from '@/components/ui/item'

export async function HomePage() {
  return (
    <ItemGroup className="container mx-auto flex flex-col gap-20 px-4 py-16 md:py-24">
      <Hero />
      <HomeMetrics />
      <Features />
      <HomeProcess />
      <HomeIndustries />
      <PricingPreview />
      <HomeSupport />
      <Testimonials />
      <Faq />
      <Cta />
    </ItemGroup>
  )
}
