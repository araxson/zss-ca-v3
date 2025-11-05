import 'server-only'

import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants/routes'
import { UserMenu } from '../shared/user-menu'

interface HeaderAuthActionsProps {
  user?: User | null
  profile?: Database['public']['Tables']['profile']['Row'] | null
}

export function HeaderAuthActions({ user, profile }: HeaderAuthActionsProps) {
  return (
    <div className="hidden md:flex md:items-center md:gap-2">
      {user ? (
        <UserMenu user={user} profile={profile ?? null} />
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href={ROUTES.LOGIN}>Log in</Link>
          </Button>
          <Button asChild>
            <Link href={ROUTES.SIGNUP}>Get started</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
