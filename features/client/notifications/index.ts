export {
  BulkNotificationForm,
  CreateNotificationForm,
  NotificationBell,
  NotificationItem,
  NotificationList,
  NotificationListAdmin,
  NotificationsFeature,
} from './components'

// Client-safe API exports (mutations and schema only)
export * from './api/mutations'
export * from './api/schema'

// Server queries must be imported directly:
// import { getNotifications } from '@/features/client/notifications/api/queries'
