import { z } from 'zod'
import { optionalUrlSchema } from '@/lib/utils/url'

export const updateProfileSchema = z.object({
  contact_name: z.string().min(1, 'Name is required').max(255),
  contact_email: z.string().email('Invalid email address').max(255),
  contact_phone: z.string().max(50).optional().or(z.literal('')),
  company_name: z.string().max(255).optional().or(z.literal('')),
  company_website: optionalUrlSchema,
  address_line1: z.string().max(255).optional().or(z.literal('')),
  address_line2: z.string().max(255).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  region: z.string().max(100).optional().or(z.literal('')),
  postal_code: z.string().max(20).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  marketing_opt_in: z.boolean().default(false),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
