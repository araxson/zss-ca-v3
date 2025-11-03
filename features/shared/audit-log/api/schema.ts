import { z } from 'zod'

export const createAuditLogSchema = z.object({
  profile_id: z.string().uuid('Invalid user ID').nullable().optional(),
  action: z.string().min(1, 'Action is required').max(100),
  resource_table: z.string().min(1, 'Resource table is required'),
  resource_id: z.string().max(255).nullable().optional(),
  change_summary: z.record(z.string(), z.unknown()),
})

export type CreateAuditLogInput = z.infer<typeof createAuditLogSchema>
