import { ROUTES } from '@/lib/constants/routes'
import type { HomeSupportData } from './support.types'

export const homeSupportData: HomeSupportData = {
  heading: 'Always-on support included',
  subheading:
    'Every plan comes with proactive maintenance, analytics insights, and a direct line to our Canadian experts.',
  highlights: [
    {
      title: 'Unlimited update requests',
      description: 'Ship changes, landing pages, or tweaks without waiting for invoices or change orders.',
    },
    {
      title: 'Managed hosting & monitoring',
      description: 'We handle security patches, uptime monitoring, and performance optimizations for you.',
    },
    {
      title: 'Quarterly strategy reviews',
      description: 'Stay ahead of customer needs with ongoing analytics reviews and roadmap recommendations.',
    },
  ],
  cta: {
    label: 'See plans',
    href: ROUTES.PRICING,
  },
}
