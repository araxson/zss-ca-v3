'use server'

import { createClient } from '@/lib/supabase/server'
import type { SignupInput } from '../../schema'
import { sendOTPForEmailConfirmation } from './helpers'

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
