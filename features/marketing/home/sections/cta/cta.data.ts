import { ROUTES } from '@/lib/constants/routes'
import type { CtaData } from './cta.types'

export const ctaData: CtaData = {
  heading: 'Ready to Get Started?',
  description:
    'Join hundreds of Canadian small businesses that trust us with their online presence. Start your subscription today.',
  ariaLabel: 'Home page call to action',
  cta: {
    primary: {
      label: 'View Pricing',
      href: ROUTES.PRICING,
    },
    secondary: {
      label: 'Contact Us',
      href: ROUTES.CONTACT,
    },
  },
}
