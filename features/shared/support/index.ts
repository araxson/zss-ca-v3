// Client-safe exports
export {
  CreateTicketForm,
  ReplyForm,
  TicketDetail,
  TicketList,
  UpdateStatusButton,
} from './components'

export {
  createTicketSchema,
  createReplySchema,
  updateTicketStatusSchema,
  replyToTicketSchema,
  type CreateTicketInput,
  type CreateReplyInput,
  type UpdateTicketStatusInput,
  type ReplyToTicketInput,
} from './schema'

// Server-only types - safe to export as types
export type { TicketWithProfile, ReplyWithProfile, TicketWithReplies } from './api/queries'
