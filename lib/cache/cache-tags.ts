/**
 * Cache Tags for Next.js Cache Revalidation
 *
 * Usage:
 * - In queries: Use with fetch() tag option or unstable_cache()
 * - In mutations: Call revalidateTag() after successful writes
 *
 * Pattern: entity-scope-identifier
 * Examples:
 * - Single resource: 'profile-user-abc123'
 * - Collection: 'subscriptions-user-abc123'
 * - Global list: 'plans-all'
 */

export const CACHE_TAGS = {
  // User profiles
  profile: (userId: string) => `profile-${userId}`,
  profiles: () => 'profiles-all',

  // Subscriptions
  subscription: (userId: string) => `subscription-${userId}`,
  subscriptions: () => 'subscriptions-all',

  // Client sites
  site: (userId: string) => `site-${userId}`,
  sites: () => 'sites-all',

  // Support tickets
  ticket: (ticketId: string) => `ticket-${ticketId}`,
  userTickets: (userId: string) => `tickets-user-${userId}`,
  tickets: () => 'tickets-all',

  // Plans (rarely change, long cache)
  plans: () => 'plans-all',

  // Admin dashboard stats
  adminStats: () => 'admin-stats',

  // Client dashboard data
  clientDashboard: (userId: string) => `client-dashboard-${userId}`,
} as const

/**
 * Common cache tag combinations for bulk revalidation
 */
export const CACHE_TAG_GROUPS = {
  // Revalidate all user-specific data
  allUserData: (userId: string) => [
    CACHE_TAGS.profile(userId),
    CACHE_TAGS.subscription(userId),
    CACHE_TAGS.site(userId),
    CACHE_TAGS.userTickets(userId),
    CACHE_TAGS.clientDashboard(userId),
  ],

  // Revalidate admin views
  allAdminViews: () => [
    CACHE_TAGS.profiles(),
    CACHE_TAGS.subscriptions(),
    CACHE_TAGS.sites(),
    CACHE_TAGS.tickets(),
    CACHE_TAGS.adminStats(),
  ],
} as const
