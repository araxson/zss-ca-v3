'use client'

import { createPortalErrorBoundary } from '@/components/error-boundaries/portal-error-boundary'
import { ERROR_ICONS, ERROR_QUICK_LINKS } from '@/lib/config'
import { ROUTES } from '@/lib/constants'

export const ClientErrorBoundary = createPortalErrorBoundary({
  portal: 'client',
  icon: ERROR_ICONS.client,
  title: 'Something went wrong',
  description:
    'We encountered an error while loading your dashboard. Please try again or contact support if the issue persists.',
  primaryAction: {
    label: 'Dashboard',
    href: ROUTES.CLIENT_DASHBOARD,
  },
  quickLinks: ERROR_QUICK_LINKS.client,
})
