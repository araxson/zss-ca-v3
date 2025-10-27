import { ROUTES } from '@/lib/constants/routes'
import type { PricingPreviewData } from './pricing-preview.types'

export const pricingPreviewData: PricingPreviewData = {
  heading: 'Simple, Transparent Pricing',
  subheading:
    'Choose the plan that fits your business. All plans include hosting, support, and maintenance.',
  tiers: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for new businesses getting online',
      priceMonthly: 199,
      priceYearly: 1990,
      features: [
        'Up to 5 pages',
        'Mobile responsive design',
        'Basic SEO setup',
        'Email support',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Ideal for growing businesses',
      priceMonthly: 349,
      priceYearly: 3490,
      popular: true,
      features: [
        'Up to 15 pages',
        'Custom design',
        'Advanced SEO',
        'Priority support',
        'Monthly analytics reports',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For established businesses',
      priceMonthly: 599,
      priceYearly: 5990,
      features: [
        'Up to 30 pages',
        'Premium custom design',
        'E-commerce integration',
        'Dedicated support',
        'Weekly analytics reports',
        'A/B testing',
      ],
    },
  ],
  cta: {
    label: 'View All Plans',
    href: ROUTES.PRICING,
  },
}
