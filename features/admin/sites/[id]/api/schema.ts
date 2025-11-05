import { z } from 'zod'
import { Constants } from '@/lib/types/database.types'
import { optionalUrlSchema, requiredUrlSchema } from '@/lib/utils/url'

const siteStatuses = Constants.public.Enums.site_status

export const updateSiteSchema = z.object({
  site_name: z.string().min(1, 'Site name is required').max(255).optional(),
  status: z.enum(siteStatuses).optional(),
  deployment_url: optionalUrlSchema,
  custom_domain: z.string().max(255).optional(),
  deployment_notes: z.string().optional(),
  design_brief: z.record(z.string(), z.unknown()).optional(),
})

export const deploySiteSchema = z.object({
  deployment_url: requiredUrlSchema,
  deployment_notes: z.string(),
})

export type UpdateSiteInput = z.infer<typeof updateSiteSchema>
export type DeploySiteInput = z.infer<typeof deploySiteSchema>
