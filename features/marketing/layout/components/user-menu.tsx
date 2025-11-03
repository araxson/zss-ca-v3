'use client'

import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'
import { signOutAction } from '../api/mutations'

type Profile = Database['public']['Tables']['profile']['Row']

interface UserMenuProps {
  user: User
  profile: Profile | null
}

function getDisplayName(user: User, profile: Profile | null) {
  return (
    profile?.contact_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    profile?.company_name ||
    user.email ||
    'Account'
  )
}

function getDisplayEmail(user: User, profile: Profile | null) {
  return profile?.contact_email || user.email || undefined
}

function getInitials(source?: string | null, fallback?: string | null) {
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
    .map(segment => segment.charAt(0))
    .join('')
    .toUpperCase()
}

export function UserMenu({ user, profile }: UserMenuProps) {
  const displayName = getDisplayName(user, profile)
  const displayEmail = getDisplayEmail(user, profile)
  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ?? undefined
  const initials = getInitials(displayName, displayEmail)

  const dashboardRoute =
    profile?.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.CLIENT_DASHBOARD
  const profileRoute =
    profile?.role === 'admin' ? ROUTES.ADMIN_PROFILE : ROUTES.CLIENT_PROFILE

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 text-sm font-medium"
        >
          <Avatar className="size-8">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={displayName} />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[140px] truncate text-left sm:block">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="text-sm font-medium">{displayName}</span>
          {displayEmail ? (
            <span className="text-xs text-muted-foreground">
              {displayEmail}
            </span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboardRoute}>Go to dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={profileRoute}>Account settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <DropdownMenuItem asChild>
            <button
              type="submit"
              className="w-full text-left"
            >
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
