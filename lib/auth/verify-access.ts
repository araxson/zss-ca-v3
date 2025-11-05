import 'server-only'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants'
import type { Database } from '@/lib/types/database.types'

type UserRole = 'admin' | 'client'
type Profile = Database['public']['Tables']['profile']['Row']

interface VerifyAccessOptions {
  requireRole?: UserRole
  redirectOnFail?: string
  allowUnauthenticated?: boolean
}

interface VerifyAccessResult {
  user: {
    id: string
    email: string
  }
  profile: Profile | null
}

export async function verifyAccess(
  options: VerifyAccessOptions = {}
): Promise<VerifyAccessResult | null> {
  const {
    requireRole,
    redirectOnFail = ROUTES.LOGIN,
    allowUnauthenticated = false,
  } = options

  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      if (allowUnauthenticated) {
        return null
      }
      redirect(redirectOnFail)
    }

    // Type guard: user is guaranteed to exist after the check above
    const authenticatedUser: User = user

    if (!authenticatedUser.email) {
      console.error('User email is missing')
      redirect(redirectOnFail)
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('*')
      .eq('id', authenticatedUser.id)
      .single()

    if (profileError || !profile) {
      console.error('Failed to fetch profile:', profileError)
      if (allowUnauthenticated) {
        return {
          user: {
            id: authenticatedUser.id,
            email: authenticatedUser.email,
          },
          profile: null,
        }
      }
      redirect(redirectOnFail)
    }

    // Type guard: profile is guaranteed to exist after the check above
    const validatedProfile: Profile = profile

    // Verify role if required
    if (requireRole && validatedProfile.role !== requireRole) {
      const roleRedirects: Record<UserRole, string> = {
        admin: ROUTES.ADMIN_DASHBOARD,
        client: ROUTES.CLIENT_DASHBOARD,
      }
      const userRole = validatedProfile.role as UserRole
      redirect(roleRedirects[userRole] || ROUTES.HOME)
    }

    return {
      user: {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
      },
      profile: validatedProfile,
    }
  } catch (error) {
    // Log error for monitoring
    console.error('Access verification failed:', error)

    // Don't expose error details to user
    redirect(redirectOnFail)
  }
}

// Convenience wrappers
export async function requireAdmin(): Promise<VerifyAccessResult | null> {
  return verifyAccess({
    requireRole: 'admin',
    redirectOnFail: ROUTES.CLIENT_DASHBOARD,
  })
}

export async function requireClient(): Promise<VerifyAccessResult | null> {
  return verifyAccess({
    requireRole: 'client',
    redirectOnFail: ROUTES.ADMIN_DASHBOARD,
  })
}

export async function requireAuth(): Promise<VerifyAccessResult | null> {
  return verifyAccess()
}

export async function getOptionalAuth(): Promise<VerifyAccessResult | null> {
  return verifyAccess({ allowUnauthenticated: true })
}
