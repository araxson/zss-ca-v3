import { z } from 'zod'

export const updateClientProfileSchema = z.object({
  profileId: z.string().uuid('Invalid profile ID'),
  fullName: z.string().min(1, 'Full name is required').optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
})

export const deleteClientSchema = z.object({
  profileId: z.string().uuid('Invalid profile ID'),
})

export type UpdateClientProfileInput = z.infer<typeof updateClientProfileSchema>
export type DeleteClientInput = z.infer<typeof deleteClientSchema>
