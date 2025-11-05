/**
 * Shared enum constants for Zod schemas
 *
 * PATTERN: Define shared enums as const arrays for type inference with z.enum
 * These should match database enums from database.types.ts
 */

// Notification types - matches notification_type enum
export const NOTIFICATION_TYPES = [
  'subscription',
  'billing',
  'support',
  'site_status',
  'system',
  'onboarding',
] as const

// Ticket categories - matches ticket_category enum
export const TICKET_CATEGORIES = [
  'technical',
  'content_change',
  'billing',
  'general_inquiry',
] as const

// Ticket priorities - matches ticket_priority enum
export const TICKET_PRIORITIES = ['low', 'medium', 'high'] as const

// Ticket statuses - matches ticket_status enum
export const TICKET_STATUSES = [
  'open',
  'in_progress',
  'resolved',
  'closed',
] as const

// Billing intervals
export const BILLING_INTERVALS = ['monthly', 'yearly'] as const

// Payment method types
export const PAYMENT_METHOD_TYPES = ['card', 'bank_account'] as const

// OTP types
export const OTP_TYPES = ['email_confirmation', 'password_reset'] as const

// Service interests for contact form
export const SERVICE_INTERESTS = [
  'website_build',
  'consultation',
  'support',
  'other',
] as const
