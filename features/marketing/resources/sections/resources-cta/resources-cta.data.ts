import { ROUTES } from '@/lib/constants/routes'
import type { ResourcesCtaData } from './resources-cta.types'

export const resourcesCtaData: ResourcesCtaData = {
  heading: 'Turn insights into launches',
  description: 'Book a strategy call to map your roadmap or subscribe today to start shipping updates with our team.',
  ariaLabel: 'Resources calls to action',
  primary: {
    label: 'Start a project',
    href: ROUTES.CONTACT,
  },
  secondary: {
    label: 'Explore pricing',
    href: ROUTES.PRICING,
  },
}
