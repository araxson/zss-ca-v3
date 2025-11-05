'use server'

import { createClient } from '@/lib/supabase/server'
import { sendOTPForPasswordReset, sendOTPForEmailConfirmation } from '@/lib/auth/otp-helpers'
import { resendOTPSchema } from '../schema'

export async function resendOTPAction(data: {
  email: string
  type: 'password_reset' | 'email_confirmation' | 'two_factor'
}): Promise<{ error: string; fieldErrors?: Record<string, string[]> } | { error: null }> {
  // Validate input with Zod
  const result = resendOTPSchema.safeParse(data)

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  const supabase = await createClient()

  // Get profile
  const { data: profile } = await supabase
    .from('profile')
    .select('id')
    .eq('contact_email', data.email)
    .single()

  if (!profile) {
    // Don't reveal if email doesn't exist (prevent account enumeration)
    return { error: null }
  }

  // Send new OTP based on type
  let error: string | null = null

  switch (data.type) {
    case 'password_reset':
      error = await sendOTPForPasswordReset(data.email, profile.id)
      break
    case 'email_confirmation':
      error = await sendOTPForEmailConfirmation(data.email, profile.id)
      break
    default:
      error = 'Invalid verification type'
  }

  if (error) {
    return { error }
  }

  return { error: null }
}
