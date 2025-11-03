export { AdminTicketDetailFeature, CreateTicketForm, NewTicketFeature, ReplyForm, SupportListFeature, TicketDetail, TicketDetailFeature, TicketList, UpdateStatusButton } from './components'

// Client-safe API exports (mutations, schema, and types)
export * from './api/mutations'
export * from './api/schema'

// Utils
export * from './utils'

// Types only (safe for client)
export type { TicketWithProfile, TicketWithReplies } from './api/queries'

// Server queries must be imported directly:
// import { getTicket, getTickets } from '@/features/shared/support/api/queries'
