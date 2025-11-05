'use client'

import * as React from 'react'
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'
import { signoutAction } from '@/lib/auth/signout'
import { getDisplayName, getDisplayEmail, getInitials } from './user-menu-helpers'

type Profile = Database['public']['Tables']['profile']['Row']

interface UserMenuProps {
  user: User
  profile: Profile | null
}

const UserMenuComponent = ({ user, profile }: UserMenuProps) => {
  const displayName = getDisplayName(user, profile)
  const displayEmail = getDisplayEmail(user, profile)
  const avatarUrl = (user.user_metadata?.['avatar_url'] as string | undefined) ?? undefined
  const initials = getInitials(displayName, displayEmail)

  const dashboardRoute =
    profile?.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.CLIENT_DASHBOARD
  const profileRoute = profile?.role === 'admin' ? ROUTES.ADMIN_PROFILE : ROUTES.CLIENT_PROFILE

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 text-sm font-medium">
          <Avatar className="size-8">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[140px] truncate text-left sm:block">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="text-sm font-medium">{displayName}</span>
          {displayEmail ? (
            <span className="text-xs text-muted-foreground">{displayEmail}</span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={dashboardRoute}>Go to dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={profileRoute}>Account settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={signoutAction}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full cursor-pointer text-left">
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const UserMenu = React.memo(UserMenuComponent)
UserMenu.displayName = 'UserMenu'
