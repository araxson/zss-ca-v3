import { z } from 'zod'
import { OTP_TYPES } from '@/lib/constants/schema-enums'

export const verifyOTPSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  type: z.enum(OTP_TYPES),
})

export const resendOTPSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  type: z.enum(OTP_TYPES),
})

export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>
export type ResendOTPInput = z.infer<typeof resendOTPSchema>
