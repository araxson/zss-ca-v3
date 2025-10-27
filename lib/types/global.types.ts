import type { Database } from './database.types'

// Table row types
export type Profile = Database['public']['Tables']['profile']['Row']
export type Plan = Database['public']['Tables']['plan']['Row']
export type Subscription = Database['public']['Tables']['subscription']['Row']
export type ClientSite = Database['public']['Tables']['client_site']['Row']
export type SupportTicket = Database['public']['Tables']['support_ticket']['Row']
export type TicketReply = Database['public']['Tables']['ticket_reply']['Row']
export type Notification = Database['public']['Tables']['notification']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profile']['Insert']
export type PlanInsert = Database['public']['Tables']['plan']['Insert']
export type SubscriptionInsert = Database['public']['Tables']['subscription']['Insert']
export type ClientSiteInsert = Database['public']['Tables']['client_site']['Insert']
export type SupportTicketInsert = Database['public']['Tables']['support_ticket']['Insert']
export type TicketReplyInsert = Database['public']['Tables']['ticket_reply']['Insert']
export type NotificationInsert = Database['public']['Tables']['notification']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profile']['Update']
export type PlanUpdate = Database['public']['Tables']['plan']['Update']
export type SubscriptionUpdate = Database['public']['Tables']['subscription']['Update']
export type ClientSiteUpdate = Database['public']['Tables']['client_site']['Update']
export type SupportTicketUpdate = Database['public']['Tables']['support_ticket']['Update']
export type TicketReplyUpdate = Database['public']['Tables']['ticket_reply']['Update']
export type NotificationUpdate = Database['public']['Tables']['notification']['Update']

// Enum types
export type UserRole = Database['public']['Enums']['user_role']
export type SubscriptionStatus = Database['public']['Enums']['subscription_status']
export type SiteStatus = Database['public']['Enums']['site_status']
export type TicketStatus = Database['public']['Enums']['ticket_status']
export type TicketPriority = Database['public']['Enums']['ticket_priority']
export type TicketCategory = Database['public']['Enums']['ticket_category']
export type NotificationType = Database['public']['Enums']['notification_type']

// Common response patterns
export type ApiResponse<T> = {
  data: T | null
  error: string | null
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Plan features type
export type PlanFeature = {
  name: string
  description: string
  included: boolean
}

// Design brief type
export type DesignBrief = {
  colors?: string[]
  style?: 'modern' | 'classic' | 'minimal'
  references?: string[]
  notes?: string
}
