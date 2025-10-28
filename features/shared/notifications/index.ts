// Client-safe exports
export {
  NotificationBell,
  NotificationList,
  NotificationListAdmin,
  NotificationItem,
  CreateNotificationForm,
  BulkNotificationForm,
} from './components'

export {
  createNotificationSchema,
  bulkCreateNotificationSchema,
  type CreateNotificationInput,
  type BulkCreateNotificationInput,
} from './schema'

// Server-only types - safe to export as types
export type { Notification, NotificationWithProfile } from './api/queries'
