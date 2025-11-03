export const NOTIFICATIONS_PAGE_METADATA = {
  title: 'Notifications',
  description: 'View and manage all system notifications',
} as const

export const NOTIFICATIONS_LABELS = {
  unread: (count: number) => `${count} unread`,
  total: (count: number) => `${count} ${count === 1 ? 'notification' : 'notifications'} total`,
} as const
