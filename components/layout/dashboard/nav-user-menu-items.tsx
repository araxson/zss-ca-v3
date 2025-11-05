'use client'

import Link from 'next/link'
import { BadgeCheck, Bell, CreditCard, LogOut } from 'lucide-react'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface NavUserMenuItemsProps {
  role: 'admin' | 'client'
  onSignOut: () => void
}

export function NavUserMenuItems({ role, onSignOut }: NavUserMenuItemsProps) {
  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href={role === 'admin' ? '/admin/profile' : '/client/profile'}>
            <BadgeCheck />
            Account
          </Link>
        </DropdownMenuItem>
        {role === 'client' && (
          <DropdownMenuItem asChild>
            <Link href="/client/subscription">
              <CreditCard />
              Subscription
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href={role === 'admin' ? '/admin/notifications' : '/client/notifications'}>
            <Bell />
            Notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onSignOut}>
        <LogOut />
        Log out
      </DropdownMenuItem>
    </>
  )
}
