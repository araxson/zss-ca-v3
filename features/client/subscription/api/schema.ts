import { z } from 'zod'
import { BILLING_INTERVALS } from '@/lib/constants/schema-enums'

export const createCheckoutSessionSchema = z.object({
  planId: z.string().uuid('Invalid plan ID'),
  billingInterval: z.enum(BILLING_INTERVALS, {
    message: 'Billing interval is required',
  }),
})

export const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().uuid('Invalid subscription ID'),
  reason: z.string().optional(),
})

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>
