'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updatePasswordSchema } from '../schema'
import { ROUTES } from '@/lib/constants/routes'

type UpdatePasswordState = {
  error?: string | null
  fieldErrors?: Record<string, string[]>
  success?: boolean
  message?: string
}

export async function updatePasswordAction(prevState: UpdatePasswordState | null, formData: FormData): Promise<UpdatePasswordState | never> {
  // Validate input with Zod
  const result = updatePasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!result.success) {
    return {
      error: 'Please check your password requirements',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  const supabase = await createClient()

  // Get email from hidden form field (passed from query params)
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Your session has expired. Please request a new password reset.' }
  }

  // Get profile by email
  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('id')
    .eq('contact_email', email)
    .single()

  if (profileError || !profile) {
    return { error: 'Unable to verify your account. Please request a new password reset.' }
  }

  // For password reset flow, we need to use resetPasswordForEmail first
  // This is a simplified implementation - in production, you should:
  // 1. Use auth.resetPasswordForEmail() to send reset link
  // 2. User clicks link with token
  // 3. Use auth.updateUser({ password }) with the token context

  // For now, since we're using OTP verification as reauthentication,
  // we can update the password directly after OTP verification
  const { error: updateError } = await supabase.auth.updateUser({
    password: result.data.password,
  })

  if (updateError) {
    console.error('Password update error:', updateError)
    return { error: 'Failed to update your password. Please try again or contact support.' }
  }

  // Clear all cached data after password change
  revalidatePath('/', 'layout')
  redirect(`${ROUTES.LOGIN}?reason=password_updated`)
}
