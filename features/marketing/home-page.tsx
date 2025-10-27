import { Hero } from './sections/hero'
import { Features } from './sections/features'
import { PricingPreview } from './sections/pricing-preview'
import { Testimonials } from './sections/testimonials'
import { Faq } from './sections/faq'
import { Cta } from './sections/cta'

export async function HomePage() {
  return (
    <div className="container mx-auto flex flex-col gap-20 px-4 py-16 md:py-24">
      <Hero />
      <Features />
      <PricingPreview />
      <Testimonials />
      <Faq />
      <Cta />
    </div>
  )
}
