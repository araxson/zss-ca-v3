export const ROUTES = {
  // Public routes
  HOME: '/',
  PRICING: '/pricing',
  ABOUT: '/about',
  CASE_STUDIES: '/case-studies',
  SERVICES: '/services',
  RESOURCES: '/resources',
  CONTACT: '/contact',

  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',
  UPDATE_PASSWORD: '/update-password',
  VERIFY_OTP: '/verify-otp',
  AUTH_CALLBACK: '/callback',

  // Client portal routes
  CLIENT_DASHBOARD: '/client/dashboard',
  CLIENT_SITES: '/client/sites',
  CLIENT_SITES_NEW: '/client/sites/new',
  CLIENT_SUPPORT: '/client/support',
  CLIENT_SUPPORT_NEW: '/client/support/new',
  CLIENT_SUBSCRIPTION: '/client/subscription',
  CLIENT_PROFILE: '/client/profile',
  CLIENT_NOTIFICATIONS: '/client/notifications',

  // Admin portal routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CLIENTS: '/admin/clients',
  ADMIN_SITES: '/admin/sites',
  ADMIN_SITES_NEW: '/admin/sites/new',
  ADMIN_SUPPORT: '/admin/support',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
} as const

export type RouteKey = keyof typeof ROUTES
export type RouteValue = typeof ROUTES[RouteKey]
