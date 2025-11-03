import 'server-only'

// Re-export shared support queries for admin portal
export { listTickets, getTicketById } from '@/features/shared/support/api/queries'
export type { TicketWithProfile } from '@/features/shared/support/api/queries'
