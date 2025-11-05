import type { Database } from './database.types'

/**
 * Global type definitions
 *
 * PATTERN: All database types are imported from Supabase generated types
 * NEVER hand-write database types - they will drift from the schema
 */

// ============================================================================
// Database Row Types
// ============================================================================

export type Profile = Database['public']['Tables']['profile']['Row']
export type Plan = Database['public']['Tables']['plan']['Row']
export type Subscription = Database['public']['Tables']['subscription']['Row']
export type ClientSite = Database['public']['Tables']['client_site']['Row']
export type SupportTicket = Database['public']['Tables']['support_ticket']['Row']
export type TicketReply = Database['public']['Tables']['ticket_reply']['Row']
export type Notification = Database['public']['Tables']['notification']['Row']

// ============================================================================
// Database Insert Types
// ============================================================================

export type ProfileInsert = Database['public']['Tables']['profile']['Insert']
export type PlanInsert = Database['public']['Tables']['plan']['Insert']
export type SubscriptionInsert = Database['public']['Tables']['subscription']['Insert']
export type ClientSiteInsert = Database['public']['Tables']['client_site']['Insert']
export type SupportTicketInsert = Database['public']['Tables']['support_ticket']['Insert']
export type TicketReplyInsert = Database['public']['Tables']['ticket_reply']['Insert']
export type NotificationInsert = Database['public']['Tables']['notification']['Insert']

// ============================================================================
// Database Update Types
// ============================================================================

export type ProfileUpdate = Database['public']['Tables']['profile']['Update']
export type PlanUpdate = Database['public']['Tables']['plan']['Update']
export type SubscriptionUpdate = Database['public']['Tables']['subscription']['Update']
export type ClientSiteUpdate = Database['public']['Tables']['client_site']['Update']
export type SupportTicketUpdate = Database['public']['Tables']['support_ticket']['Update']
export type TicketReplyUpdate = Database['public']['Tables']['ticket_reply']['Update']
export type NotificationUpdate = Database['public']['Tables']['notification']['Update']

// ============================================================================
// Database Enum Types (use literal unions in app code, these for DB)
// ============================================================================

export type UserRole = Database['public']['Enums']['user_role']
export type SubscriptionStatus = Database['public']['Enums']['subscription_status']
export type SiteStatus = Database['public']['Enums']['site_status']
export type TicketStatus = Database['public']['Enums']['ticket_status']
export type TicketPriority = Database['public']['Enums']['ticket_priority']
export type TicketCategory = Database['public']['Enums']['ticket_category']
export type NotificationType = Database['public']['Enums']['notification_type']

// ============================================================================
// API Response Patterns (using discriminated unions)
// ============================================================================

/**
 * Standard API response wrapper
 * Use discriminated union for type safety
 */
export type ApiResponse<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: string
    }

/**
 * Paginated response with metadata
 */
export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

// ============================================================================
// Domain Types
// ============================================================================

/**
 * Plan feature definition
 */
export type PlanFeature = {
  name: string
  description: string
  included: boolean
}

/**
 * Design brief structure for site creation
 */
export type DesignBrief = {
  colors?: readonly string[]
  style?: 'modern' | 'classic' | 'minimal'
  references?: readonly string[]
  notes?: string
}
