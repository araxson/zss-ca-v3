import { z } from 'zod'

export const createSiteSchema = z.object({
  profile_id: z.string().uuid('Invalid client ID'),
  site_name: z.string().min(1, 'Site name is required').max(255),
  design_brief: z.record(z.string(), z.unknown()),
  plan_id: z.string().uuid('Invalid plan ID').nullish(),
  subscription_id: z.string().uuid('Invalid subscription ID').nullish(),
})

export type CreateSiteInput = z.infer<typeof createSiteSchema>
