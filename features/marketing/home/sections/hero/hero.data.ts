import { ROUTES } from '@/lib/constants/routes'
import type { HeroData } from './hero.types'

export const heroData: HeroData = {
  title: 'Professional Websites for Canadian Small Businesses',
  description:
    'Subscribe to a website plan designed for your business. We build, deploy, and maintain your site—so you can focus on growing.',
  tagline: 'Predictable pricing. Professional results.',
  cta: {
    primary: {
      label: 'View Pricing',
      href: ROUTES.PRICING,
    },
    secondary: {
      label: 'View Services',
      href: ROUTES.SERVICES,
    },
  },
}
