import { z } from 'zod'

export const createSiteSchema = z.object({
  profile_id: z.string().uuid('Invalid client ID'),
  site_name: z.string().min(1, 'Site name is required').max(255),
  design_brief: z.record(z.string(), z.unknown()).default({}),
  plan_id: z.string().uuid('Invalid plan ID').optional().or(z.literal('')),
  subscription_id: z.string().uuid('Invalid subscription ID').optional().or(z.literal('')),
})

export type CreateSiteInput = z.infer<typeof createSiteSchema>
