import { z } from 'zod'

export const verifyOTPSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  type: z.enum(['email_confirmation', 'password_reset']),
})

export const resendOTPSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  type: z.enum(['email_confirmation', 'password_reset']),
})

export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>
export type ResendOTPInput = z.infer<typeof resendOTPSchema>
