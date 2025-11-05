import { z } from 'zod'
import { optionalUrlSchema } from '@/lib/utils/url'

export const updateProfileSchema = z.object({
  contact_name: z.string().min(1, 'Name is required').max(255),
  contact_email: z.string().email('Invalid email address').max(255),
  contact_phone: z.string().max(50).default(''),
  company_name: z.string().max(255).default(''),
  company_website: optionalUrlSchema,
  address_line1: z.string().max(255).default(''),
  address_line2: z.string().max(255).default(''),
  city: z.string().max(100).default(''),
  region: z.string().max(100).default(''),
  postal_code: z.string().max(20).default(''),
  country: z.string().max(100).default(''),
  marketing_opt_in: z.boolean().default(false),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
