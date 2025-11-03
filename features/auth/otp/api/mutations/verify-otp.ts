'use server'

import { createClient } from '@/lib/supabase/server'

export async function verifyOTPAction(data: {
  email: string
  otp: string
  type: 'password_reset' | 'email_confirmation' | 'two_factor'
}) {
  const supabase = await createClient()

  // Call the verify_otp function
  const { data: result, error } = await supabase.rpc('verify_otp', {
    p_email: data.email,
    p_otp_code: data.otp,
    p_verification_type: data.type,
  })

  // Type guard for the result
  const otpResult = result as { success: boolean; message?: string; profile_id?: string } | null

  if (error || !otpResult?.success) {
    return { error: otpResult?.message || 'Invalid or expired code' }
  }

  // If email confirmation, update user metadata
  if (data.type === 'email_confirmation') {
    const { error: updateError } = await supabase.auth.updateUser({
      data: { email_verified: true },
    })

    if (updateError) {
      return { error: 'Failed to confirm email' }
    }
  }

  return {
    success: true,
    profileId: otpResult.profile_id,
  }
}
