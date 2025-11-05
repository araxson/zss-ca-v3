import 'server-only'

import { redirect } from 'next/navigation'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'
import { ROUTES } from '@/lib/constants/routes'

type Profile = Database['public']['Tables']['profile']['Row']

/**
 * Verify if a user has admin role
 * @param supabase - Supabase client instance
 * @param userId - User ID to check
 * @returns true if user is admin, false otherwise
 */
export async function verifyAdminRole(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<boolean> {
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', userId)
    .single()

  return profile?.role === 'admin'
}

/**
 * Require admin role or redirect to client dashboard
 * @param supabase - Supabase client instance
 * @param userId - User ID to check
 * @throws Never returns if user is not admin (redirects instead)
 */
export async function requireAdminRole(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<void> {
  if (!(await verifyAdminRole(supabase, userId))) {
    // ✅ Redirect non-admin users to client dashboard instead of throwing
    redirect(ROUTES.CLIENT_DASHBOARD)
  }
}

/**
 * Get authenticated user or redirect to login
 * @param supabase - Supabase client instance
 * @returns User object
 * @throws Never returns if not authenticated (redirects instead)
 */
export async function requireAuth(supabase: SupabaseClient<Database>): Promise<{ id: string; email?: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // ✅ CRITICAL: Use redirect() instead of throw for proper Next.js navigation
    // This is the correct pattern for Server Components and layouts
    redirect(ROUTES.LOGIN)
  }

  return user
}

/**
 * Verify user role matches one of the allowed roles
 * @param supabase - Supabase client instance
 * @param userId - User ID to check
 * @param allowedRoles - Array of allowed roles
 * @returns true if user has one of the allowed roles
 */
export async function verifyRole(
  supabase: SupabaseClient<Database>,
  userId: string,
  allowedRoles: Profile['role'][]
): Promise<boolean> {
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', userId)
    .single()

  return allowedRoles.includes(profile?.role as Profile['role'])
}

/**
 * Get user profile
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @returns Profile or null
 */
export async function getUserProfile(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<Profile | null> {
  const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .eq('id', userId)
    .single()

  return profile
}
