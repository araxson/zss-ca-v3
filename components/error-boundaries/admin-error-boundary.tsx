'use client'

import { createPortalErrorBoundary } from '@/components/error-boundaries/portal-error-boundary'
import { ERROR_ICONS, ERROR_QUICK_LINKS } from '@/lib/config'
import { ROUTES } from '@/lib/constants'

export const AdminErrorBoundary = createPortalErrorBoundary({
  portal: 'admin',
  icon: ERROR_ICONS.admin,
  title: 'Error in Admin Portal',
  description:
    'An error occurred while processing your request. This has been logged for review.',
  primaryAction: {
    label: 'Dashboard',
    href: ROUTES.ADMIN_DASHBOARD,
  },
  quickLinks: ERROR_QUICK_LINKS.admin,
})
