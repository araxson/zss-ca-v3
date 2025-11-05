'use client'

import { createPortalErrorBoundary } from '@/components/error-boundaries/portal-error-boundary'
import { ERROR_ICONS, ERROR_QUICK_LINKS } from '@/lib/config'
import { ROUTES } from '@/lib/constants'

export const AuthErrorBoundary = createPortalErrorBoundary({
  portal: 'auth',
  icon: ERROR_ICONS.auth,
  title: 'Authentication Error',
  description:
    'An error occurred during the authentication process. Please try again.',
  primaryAction: {
    label: 'Back to Login',
    href: ROUTES.LOGIN,
  },
  secondaryActions: [
    {
      label: 'Go Home',
      href: ROUTES.HOME,
      variant: 'ghost',
    },
  ],
  quickLinks: ERROR_QUICK_LINKS.auth,
})
