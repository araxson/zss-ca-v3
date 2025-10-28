'use server'

import { createClient } from '@/lib/supabase/server'
import type { ResetPasswordInput } from '../../schema'
import { sendOTPForPasswordReset } from './helpers'

export async function resetPasswordAction(data: ResetPasswordInput) {
  const supabase = await createClient()

  // Check if user exists
  const { data: profile } = await supabase
    .from('profile')
    .select('id, contact_email')
    .eq('contact_email', data.email)
    .single()

  if (!profile) {
    // Don't reveal if user doesn't exist
    return {
      success: true,
      message: 'If your email is registered, you will receive a verification code',
    }
  }

  // Generate and send OTP
  const error = await sendOTPForPasswordReset(data.email, profile.id)

  if (error) {
    return { error: 'Failed to send verification code. Please try again.' }
  }

  return {
    success: true,
    message: 'Check your email for verification code',
  }
}
