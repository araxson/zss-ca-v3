import { z } from 'zod'

export const markNotificationReadSchema = z.object({
  notificationId: z.string().uuid(),
})

export const markAllNotificationsReadSchema = z.object({})

export const createNotificationSchema = z.object({
  profile_id: z.string().uuid('Invalid user ID'),
  notification_type: z.enum([
    'subscription',
    'billing',
    'support',
    'site_status',
    'system',
    'onboarding',
  ]),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  body: z.string().max(2000, 'Body too long').nullable().optional(),
  action_url: z.string().url('Invalid URL').nullable().optional(),
  expires_at: z.string().datetime().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const deleteNotificationSchema = z.object({
  notificationId: z.string().uuid(),
})

export const bulkCreateNotificationSchema = z.object({
  notification_type: z.enum([
    'subscription',
    'billing',
    'support',
    'site_status',
    'system',
    'onboarding',
  ]),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  body: z.string().max(2000, 'Body too long').nullable().optional(),
  action_url: z.string().url('Invalid URL').nullable().optional(),
  expires_at: z.string().datetime().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>
export type MarkAllNotificationsReadInput = z.infer<typeof markAllNotificationsReadSchema>
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>
export type DeleteNotificationInput = z.infer<typeof deleteNotificationSchema>
export type BulkCreateNotificationInput = z.infer<typeof bulkCreateNotificationSchema>
