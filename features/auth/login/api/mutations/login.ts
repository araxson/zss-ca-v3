'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { loginSchema } from '../schema'

type LoginState = {
  error?: string | null
  fieldErrors?: Record<string, string[]>
}

// Rate limiting for login attempts (5 attempts per 5 minutes per email)
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function rateLimit(email: string, maxAttempts = 5, windowMs = 300000) {
  const now = Date.now()
  const attempts = loginAttempts.get(email)

  if (attempts && attempts.resetAt > now) {
    if (attempts.count >= maxAttempts) {
      return {
        limited: true,
        retryAfter: Math.ceil((attempts.resetAt - now) / 1000),
      }
    }
    attempts.count++
  } else {
    loginAttempts.set(email, { count: 1, resetAt: now + windowMs })
  }

  return { limited: false }
}

export async function loginAction(prevState: LoginState | null, formData: FormData): Promise<LoginState | never> {
  const remember = formData.get('remember') === 'on'

  // Validate input with Zod
  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  // Check rate limit
  const rateCheck = rateLimit(result.data.email)
  if (rateCheck.limited) {
    return {
      error: `Too many login attempts. Please try again in ${rateCheck.retryAfter} seconds.`
    }
  }

  const supabase = await createClient({
    cookieMaxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 12,
  })

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })

  if (error) {
    console.error('Login error:', error)
    // Generic error message to prevent account enumeration
    return { error: 'Invalid email or password' }
  }

  // Clear rate limit on successful login
  loginAttempts.delete(result.data.email)

  // Get user profile to determine role
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profile')
      .select('role')
      .eq('id', user.id)
      .single()

    // ✅ CRITICAL: Clear all cached data after login
    // This ensures fresh user-specific data is loaded
    revalidatePath('/', 'layout')

    // Redirect based on user role
    const redirectUrl = profile?.role === 'admin'
      ? ROUTES.ADMIN_DASHBOARD
      : ROUTES.CLIENT_DASHBOARD

    redirect(redirectUrl)
  }

  // ✅ Clear cache before fallback redirect
  revalidatePath('/', 'layout')
  redirect(ROUTES.CLIENT_DASHBOARD)
}
