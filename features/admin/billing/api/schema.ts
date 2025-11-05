import { z } from 'zod'
import { PAYMENT_METHOD_TYPES } from '@/lib/constants/schema-enums'

export const paymentMethodSchema = z.object({
  type: z.enum(PAYMENT_METHOD_TYPES),
  isDefault: z.boolean().optional(),
})

export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>
