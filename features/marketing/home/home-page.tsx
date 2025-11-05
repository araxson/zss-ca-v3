import {
  Hero,
  HomeMetrics,
  Features,
  HomeProcess,
  HomeIndustries,
  PricingPreview,
  HomeSupport,
  Testimonials,
  Faq,
  Cta,
} from './sections'
import {
  organizationSchema,
  websiteSchema,
  serviceSchema,
} from '@/lib/config/structured-data'

export async function HomePage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <div className="container mx-auto flex flex-col gap-20 px-4 py-16 md:py-24">
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
      </div>
    </>
  )
}
