import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

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
 * Require admin role or throw error
 * @param supabase - Supabase client instance
 * @param userId - User ID to check
 * @throws Error if user is not admin
 */
export async function requireAdminRole(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<void> {
  if (!(await verifyAdminRole(supabase, userId))) {
    throw new Error('Admin access required')
  }
}

/**
 * Get authenticated user or throw error
 * @param supabase - Supabase client instance
 * @returns User object
 * @throws Error if not authenticated
 */
export async function requireAuth(supabase: SupabaseClient<Database>) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
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
