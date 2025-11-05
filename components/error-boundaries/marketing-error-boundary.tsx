'use client'

import { createPortalErrorBoundary } from '@/components/error-boundaries/portal-error-boundary'
import { ERROR_ICONS, ERROR_QUICK_LINKS } from '@/lib/config'
import { ROUTES } from '@/lib/constants'

export const MarketingErrorBoundary = createPortalErrorBoundary({
  portal: 'marketing',
  icon: ERROR_ICONS.marketing,
  title: 'Oops! Something went wrong',
  description:
    'We encountered an error while loading this page. Please try again.',
  primaryAction: {
    label: 'Go Home',
    href: ROUTES.HOME,
  },
  secondaryActions: [
    {
      label: 'Contact Us',
      href: ROUTES.CONTACT,
      variant: 'outline',
    },
  ],
  quickLinks: ERROR_QUICK_LINKS.marketing,
})
