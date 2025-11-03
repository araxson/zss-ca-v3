import { z } from 'zod'

export const paymentMethodSchema = z.object({
  type: z.enum(['card', 'bank_account']),
  isDefault: z.boolean().optional(),
})

export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>
