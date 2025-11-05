import 'server-only'

import { revalidatePath } from 'next/cache'

/**
 * Revalidate multiple paths at once
 * @param routes - Array of route paths to revalidate
 */
export function revalidatePaths(routes: string[]): void {
  routes.forEach((route) => revalidatePath(route, 'page'))
}

/**
 * Common revalidation path groups
 */
export const REVALIDATE_GROUPS = {
  SUPPORT: ['/client/support', '/admin/support'] as string[],
  SITES: ['/client/sites', '/admin/sites'] as string[],
  DASHBOARD: ['/client', '/admin'] as string[],
  NOTIFICATIONS: ['/client/notifications', '/admin/notifications'] as string[],
  PROFILE: ['/client/profile', '/admin/profile'] as string[],
  ANALYTICS: ['/client/analytics', '/admin/analytics'] as string[],
}

/**
 * Revalidate support-related pages
 */
export function revalidateSupport(): void {
  revalidatePaths(REVALIDATE_GROUPS.SUPPORT)
}

/**
 * Revalidate site-related pages
 */
export function revalidateSites(): void {
  revalidatePaths(REVALIDATE_GROUPS.SITES)
}

/**
 * Revalidate dashboard pages
 */
export function revalidateDashboard(): void {
  revalidatePaths(REVALIDATE_GROUPS.DASHBOARD)
}

/**
 * Revalidate notification pages
 */
export function revalidateNotifications(): void {
  revalidatePaths(REVALIDATE_GROUPS.NOTIFICATIONS)
}

/**
 * Revalidate profile pages
 */
export function revalidateProfile(): void {
  revalidatePaths(REVALIDATE_GROUPS.PROFILE)
}

/**
 * Revalidate analytics pages
 */
export function revalidateAnalytics(): void {
  revalidatePaths(REVALIDATE_GROUPS.ANALYTICS)
}
