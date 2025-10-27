import { ROUTES } from '@/lib/constants/routes'
import type { ServiceCtaData } from './service-cta.types'

export const serviceCtaData: ServiceCtaData = {
  heading: 'Ready to build your next website?',
  description: 'Choose a plan or schedule a discovery call to see how the subscription fits your roadmap.',
  primary: {
    label: 'Compare pricing',
    href: ROUTES.PRICING,
  },
  secondary: {
    label: 'Talk to an expert',
    href: ROUTES.CONTACT,
  },
}
