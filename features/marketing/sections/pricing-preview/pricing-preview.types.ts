export interface PricingTier {
  id: string
  name: string
  description: string
  priceMonthly: number
  priceYearly: number
  popular?: boolean
  features: string[]
}

export interface PricingPreviewData {
  heading: string
  subheading: string
  tiers: PricingTier[]
  cta: {
    label: string
    href: string
  }
}
