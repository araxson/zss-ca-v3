// Home page
export { HomePage } from './home-page'
export { homePageMetadata } from './home-page.seo'

// Sections
export { Hero, heroData } from './sections/hero'
export { Features, featuresData } from './sections/features'
export { PricingPreview, pricingPreviewData, getPlansForPreview } from './sections/pricing-preview'
export { Testimonials, testimonialsData } from './sections/testimonials'
export { Faq, faqData } from './sections/faq'
export { Cta, ctaData } from './sections/cta'

// Types
export type { HeroData } from './sections/hero'
export type { Feature, FeaturesData } from './sections/features'
export type { PricingTier, PricingPreviewData, PlanWithPricing } from './sections/pricing-preview'
export type { Testimonial, TestimonialsData } from './sections/testimonials'
export type { FaqItem, FaqData } from './sections/faq'
export type { CtaData } from './sections/cta'
