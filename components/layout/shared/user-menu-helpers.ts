import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profile']['Row']

export function getDisplayName(user: User, profile: Profile | null): string {
  return (
    profile?.contact_name ||
    (user.user_metadata?.['full_name'] as string | undefined) ||
    profile?.company_name ||
    user.email ||
    'Account'
  )
}

export function getDisplayEmail(user: User, profile: Profile | null): string | undefined {
  return profile?.contact_email || user.email || undefined
}

export function getInitials(source?: string | null, fallback?: string | null): string {
  const target = source?.trim() || fallback?.trim()
  if (!target) return 'U'

  const segments = target
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)

  if (segments.length === 0 && fallback) {
    return fallback.charAt(0).toUpperCase()
  }

  return segments
    .map((segment) => segment.charAt(0))
    .join('')
    .toUpperCase()
}
