import { z } from 'zod'

export const updateSettingsSchema = z.object({
  siteName: z.string().min(1).optional(),
  supportEmail: z.string().email().optional(),
  maintenanceMode: z.boolean().optional(),
})

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
