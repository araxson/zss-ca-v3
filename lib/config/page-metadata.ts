import { ROUTES } from '@/lib/constants'

interface PageMetadata {
  title: string
  description?: string
}

// Admin page metadata
export const ADMIN_PAGE_METADATA: Record<string, PageMetadata> = {
  [ROUTES.ADMIN_DASHBOARD]: {
    title: 'Dashboard',
    description: 'Overview of your platform metrics and activities',
  },
  [ROUTES.ADMIN_CLIENTS]: {
    title: 'Clients',
    description: 'Manage client accounts and profiles',
  },
  '/admin/clients/[id]': {
    title: 'Client Details',
    description: 'View and manage client information',
  },
  [ROUTES.ADMIN_SITES]: {
    title: 'Sites',
    description: 'Manage all client websites and deployments',
  },
  [ROUTES.ADMIN_SITES_NEW]: {
    title: 'New Site',
    description: 'Create a new website for a client',
  },
  '/admin/sites/[id]': {
    title: 'Site Details',
    description: 'View and manage site information',
  },
  [ROUTES.ADMIN_SUPPORT]: {
    title: 'Support Tickets',
    description: 'Manage and respond to customer support requests',
  },
  '/admin/support/[id]': {
    title: 'Ticket Details',
    description: 'View and respond to support ticket',
  },
  [ROUTES.ADMIN_NOTIFICATIONS]: {
    title: 'Notifications',
    description: 'View and manage system notifications',
  },
  [ROUTES.ADMIN_PROFILE]: {
    title: 'Profile Settings',
    description: 'Manage your account information and preferences',
  },
  [ROUTES.ADMIN_AUDIT_LOGS]: {
    title: 'Audit Logs',
    description: 'View system activity and security logs',
  },
  '/admin/analytics': {
    title: 'Analytics',
    description: 'View detailed platform analytics and insights',
  },
  '/admin/billing': {
    title: 'Billing',
    description: 'Manage billing and payment information',
  },
  '/admin/settings': {
    title: 'Settings',
    description: 'Configure platform settings and preferences',
  },
}

// Client page metadata
export const CLIENT_PAGE_METADATA: Record<string, PageMetadata> = {
  [ROUTES.CLIENT_DASHBOARD]: {
    title: 'Dashboard',
    description: 'Overview of your sites and activities',
  },
  [ROUTES.CLIENT_SITES]: {
    title: 'My Sites',
    description: 'Manage your websites and view deployment status',
  },
  '/client/sites/[id]': {
    title: 'Site Details',
    description: 'View and manage your website',
  },
  [ROUTES.CLIENT_SUBSCRIPTION]: {
    title: 'Subscription',
    description: 'Manage your subscription plan and billing',
  },
  [ROUTES.CLIENT_SUPPORT]: {
    title: 'Support',
    description: 'Get help and view your support tickets',
  },
  [ROUTES.CLIENT_SUPPORT_NEW]: {
    title: 'New Support Ticket',
    description: 'Submit a new support request',
  },
  '/client/support/[id]': {
    title: 'Ticket Details',
    description: 'View and manage your support ticket',
  },
  [ROUTES.CLIENT_NOTIFICATIONS]: {
    title: 'Notifications',
    description: 'View your notifications and updates',
  },
  [ROUTES.CLIENT_PROFILE]: {
    title: 'Profile',
    description: 'Manage your account information and settings',
  },
}

/**
 * Get page metadata for a given pathname and user role
 *
 * Attempts exact match first, then tries to match dynamic route patterns
 * (e.g., /admin/clients/[id])
 *
 * @param pathname - The current page pathname
 * @param role - The user's role (admin or client)
 * @returns PageMetadata object if found, null otherwise
 */
export function getPageMetadata(pathname: string, role: 'admin' | 'client'): PageMetadata | null {
  const metadata = role === 'admin' ? ADMIN_PAGE_METADATA : CLIENT_PAGE_METADATA

  // Try exact match first
  const exactMatch = metadata[pathname]
  if (exactMatch) {
    return exactMatch
  }

  // Try to find a match for dynamic routes (e.g., /admin/clients/[id])
  const pathSegments = pathname.split('/').filter(Boolean)

  for (const [route, meta] of Object.entries(metadata)) {
    const routeSegments = route.split('/').filter(Boolean)

    if (pathSegments.length === routeSegments.length) {
      const matches = routeSegments.every((segment, i) => {
        const pathSegment = pathSegments[i]
        return segment === pathSegment || segment.startsWith('[')
      })

      if (matches) {
        return meta
      }
    }
  }

  return null
}
