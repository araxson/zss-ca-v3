'use server'

import { createClient } from '@/lib/supabase/server'
import { verifyOTPAction } from './verify-otp'

export async function updatePasswordAction(data: {
  email: string
  password: string
  otp?: string
}) {
  const supabase = await createClient()

  // If OTP is provided, verify it first
  if (data.otp) {
    const verifyResult = await verifyOTPAction({
      email: data.email,
      otp: data.otp,
      type: 'password_reset',
    })

    if (verifyResult.error) {
      return { error: verifyResult.error }
    }
  }

  // Get profile by email
  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('id')
    .eq('contact_email', data.email)
    .single()

  if (profileError || !profile) {
    return { error: 'User not found' }
  }

  // Update password
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    profile.id,
    { password: data.password }
  )

  if (updateError) {
    return { error: 'Failed to update password' }
  }

  return {
    success: true,
    message: 'Password updated successfully',
  }
}
