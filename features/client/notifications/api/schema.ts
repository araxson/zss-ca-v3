import { z } from 'zod'
import { NOTIFICATION_TYPES } from '@/lib/constants/schema-enums'

export const markNotificationReadSchema = z.object({
  notificationId: z.string().uuid(),
})

export const markAllNotificationsReadSchema = z.object({})

export const createNotificationSchema = z.object({
  profile_id: z.string().uuid('Invalid user ID'),
  notification_type: z.enum(NOTIFICATION_TYPES),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  body: z.string().max(2000, 'Body too long').nullish(),
  action_url: z.string().url('Invalid URL').nullish(),
  expires_at: z.string().datetime().nullish(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const deleteNotificationSchema = z.object({
  notificationId: z.string().uuid(),
})

export const bulkCreateNotificationSchema = z.object({
  notification_type: z.enum(NOTIFICATION_TYPES),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  body: z.string().max(2000, 'Body too long').nullish(),
  action_url: z.string().url('Invalid URL').nullish(),
  expires_at: z.string().datetime().nullish(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>
export type MarkAllNotificationsReadInput = z.infer<typeof markAllNotificationsReadSchema>
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>
export type DeleteNotificationInput = z.infer<typeof deleteNotificationSchema>
export type BulkCreateNotificationInput = z.infer<typeof bulkCreateNotificationSchema>
