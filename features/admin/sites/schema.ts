import { z } from 'zod'
import { Constants } from '@/lib/types/database.types'
import { optionalUrlSchema, requiredUrlSchema } from '@/lib/utils/url'

const siteStatuses = Constants.public.Enums.site_status

export const createSiteSchema = z.object({
  profile_id: z.string().uuid('Invalid client ID'),
  site_name: z.string().min(1, 'Site name is required').max(255),
  design_brief: z.record(z.string(), z.unknown()).optional().default({}),
  plan_id: z.string().uuid('Invalid plan ID').optional().or(z.literal('')),
  subscription_id: z.string().uuid('Invalid subscription ID').optional().or(z.literal('')),
})

export const updateSiteSchema = z.object({
  site_name: z.string().min(1, 'Site name is required').max(255).optional(),
  status: z.enum(siteStatuses).optional(),
  deployment_url: optionalUrlSchema,
  custom_domain: z.string().max(255).optional().or(z.literal('')),
  deployment_notes: z.string().optional().or(z.literal('')),
  design_brief: z.record(z.string(), z.unknown()).optional(),
})

export const deploySiteSchema = z.object({
  deployment_url: requiredUrlSchema,
  deployment_notes: z.string().optional().or(z.literal('')),
})

export type CreateSiteInput = z.infer<typeof createSiteSchema>
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>
export type DeploySiteInput = z.infer<typeof deploySiteSchema>
