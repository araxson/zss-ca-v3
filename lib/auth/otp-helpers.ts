'use server'

import { createClient } from '@/lib/supabase/server'
import { sendOTPEmail } from '@/lib/email/send'

export async function sendOTPForPasswordReset(
  email: string,
  profileId: string
): Promise<string | null> {
  const supabase = await createClient()

  // Generate OTP code
  const { data: otpCode } = await supabase.rpc('generate_otp_code')

  if (!otpCode) {
    return 'Failed to generate OTP code'
  }

  // Store OTP in database
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 15) // 15 minutes expiry

  const { error: insertError } = await supabase

    .from('otp_verification')
    .insert({
      profile_id: profileId,
      email,
      otp_code: otpCode,
      verification_type: 'password_reset',
      expires_at: expiresAt.toISOString(),
    })

  if (insertError) {
    return 'Failed to store verification code'
  }

  // Send email with OTP
  const emailSent = await sendOTPEmail(
    email,
    'Reset Your Password',
    otpCode,
    'Use this code to reset your password. The code will expire in 15 minutes.'
  )

  if (!emailSent) {
    return 'Failed to send email'
  }

  return null
}

export async function sendOTPForEmailConfirmation(
  email: string,
  profileId: string
): Promise<string | null> {
  const supabase = await createClient()

  // Generate OTP code
  const { data: otpCode } = await supabase.rpc('generate_otp_code')

  if (!otpCode) {
    return 'Failed to generate OTP code'
  }

  // Store OTP in database
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 30) // 30 minutes expiry for email confirmation

  const { error: insertError } = await supabase

    .from('otp_verification')
    .insert({
      profile_id: profileId,
      email,
      otp_code: otpCode,
      verification_type: 'email_confirmation',
      expires_at: expiresAt.toISOString(),
    })

  if (insertError) {
    return 'Failed to store verification code'
  }

  // Send email with OTP
  const emailSent = await sendOTPEmail(
    email,
    'Confirm Your Email',
    otpCode,
    'Use this code to confirm your email address. The code will expire in 30 minutes.'
  )

  if (!emailSent) {
    return 'Failed to send email'
  }

  return null
}
