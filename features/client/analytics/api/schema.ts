import { z } from 'zod'

export const createAnalyticsSchema = z.object({
  client_site_id: z.string().uuid('Invalid site ID'),
  metric_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  page_views: z.number().int().min(0, 'Page views must be non-negative'),
  unique_visitors: z.number().int().min(0, 'Unique visitors must be non-negative'),
  conversions: z.number().int().min(0, 'Conversions must be non-negative'),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const updateAnalyticsSchema = z.object({
  id: z.number().int().positive(),
  page_views: z.number().int().min(0, 'Page views must be non-negative').optional(),
  unique_visitors: z.number().int().min(0, 'Unique visitors must be non-negative').optional(),
  conversions: z.number().int().min(0, 'Conversions must be non-negative').optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const deleteAnalyticsSchema = z.object({
  id: z.number().int().positive(),
})

export type CreateAnalyticsInput = z.infer<typeof createAnalyticsSchema>
export type UpdateAnalyticsInput = z.infer<typeof updateAnalyticsSchema>
export type DeleteAnalyticsInput = z.infer<typeof deleteAnalyticsSchema>
