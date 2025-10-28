import { z } from 'zod'

export const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  serviceInterest: z.enum(['website_build', 'consultation', 'support', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
