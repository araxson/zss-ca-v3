'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { sendOTPEmail } from '@/lib/email/send'
import type { LoginInput, SignupInput, ResetPasswordInput } from '../schema'

export async function loginAction(data: LoginInput) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: error.message }
  }

  // Get user profile to determine role
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profile')
      .select('role')
      .eq('id', user.id)
      .single()

    // Redirect based on user role
    const redirectUrl = profile?.role === 'admin'
      ? ROUTES.ADMIN_DASHBOARD
      : ROUTES.CLIENT_DASHBOARD

    redirect(redirectUrl)
  }

  redirect(ROUTES.CLIENT_DASHBOARD)
}

export async function signupAction(data: SignupInput) {
  const supabase = await createClient()

  // First, sign up the user
  const { data: authData, error: signupError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        company_name: data.companyName,
      },
    },
  })

  if (signupError) {
    return { error: signupError.message }
  }

  // Generate and send OTP for email confirmation
  if (authData.user) {
    const otpError = await sendOTPForEmailConfirmation(data.email, authData.user.id)
    if (otpError) {
      return { error: otpError }
    }
  }

  return {
    success: true,
    message: 'Check your email for verification code',
  }
}

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

export async function resendOTPAction(data: {
  email: string
  type: 'password_reset' | 'email_confirmation' | 'two_factor'
}) {
  const supabase = await createClient()

  // Get profile
  const { data: profile } = await supabase
    .from('profile')
    .select('id')
    .eq('contact_email', data.email)
    .single()

  if (!profile) {
    return { error: 'Email not found' }
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

  return { success: true }
}

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

async function sendOTPForPasswordReset(email: string, profileId: string): Promise<string | null> {
  const supabase = await createClient()

  // Generate OTP code
  const { data: otpCode } = await supabase.rpc('generate_otp_code')

  if (!otpCode) {
    return 'Failed to generate OTP code'
  }

  // Store OTP in database
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 15) // 15 minutes expiry

  const { error: insertError } = await supabase.from('otp_verification').insert({
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

async function sendOTPForEmailConfirmation(
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

  const { error: insertError } = await supabase.from('otp_verification').insert({
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

export async function signoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect(ROUTES.LOGIN)
}