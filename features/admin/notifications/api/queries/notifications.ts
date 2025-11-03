import 'server-only'

// Re-export admin notification queries from shared feature
export {
  listNotificationsAdmin,
  getUnreadNotificationCount
} from '@/features/shared/notifications/api/queries'
