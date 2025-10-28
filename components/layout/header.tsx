import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { Menu } from 'lucide-react'

import { navigationMenuTriggerStyle, NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ROUTES } from '@/lib/constants/routes'
import { siteConfig } from '@/lib/config/site.config'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profile']['Row']

const marketingNavItems = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Services', href: ROUTES.SERVICES },
  { label: 'Pricing', href: ROUTES.PRICING },
  { label: 'Case Studies', href: ROUTES.CASE_STUDIES },
  { label: 'Resources', href: ROUTES.RESOURCES },
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'Contact', href: ROUTES.CONTACT },
]

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile: Profile | null = null

  if (user) {
    const { data } = await supabase
      .from('profile')
      .select('*')
      .eq('id', user.id)
      .single()

    profile = data ?? null
  }

  const portalLink = user
    ? profile?.role === 'admin'
      ? { label: 'Admin Portal', href: ROUTES.ADMIN_DASHBOARD }
      : { label: 'Client Portal', href: ROUTES.CLIENT_DASHBOARD }
    : null

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href={ROUTES.HOME}
            className="flex items-center font-semibold tracking-tight"
          >
            <span className="hidden text-base sm:inline-block">
              {siteConfig.name}
            </span>
            <span className="text-base sm:hidden">{siteConfig.shortName}</span>
          </Link>
          <NavigationMenu className="hidden md:flex" viewport={false}>
            <NavigationMenuList>
              {marketingNavItems.map(item => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              {portalLink ? (
                <NavigationMenuItem key={portalLink.href}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={portalLink.href}>{portalLink.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : null}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="size-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>{siteConfig.shortName}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-6">
                <nav className="flex flex-col gap-2">
                  {marketingNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                  {portalLink && (
                    <>
                      <Separator className="my-2" />
                      <Link
                        href={portalLink.href}
                        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                      >
                        {portalLink.label}
                      </Link>
                    </>
                  )}
                </nav>

                <Separator />

                <div className="flex flex-col gap-2">
                  {user ? (
                    <Button asChild>
                      <Link href={profile?.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.CLIENT_DASHBOARD}>
                        Go to Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" asChild>
                        <Link href={ROUTES.LOGIN}>Log in</Link>
                      </Button>
                      <Button asChild>
                        <Link href={ROUTES.SIGNUP}>Get started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="hidden md:flex md:items-center md:gap-2">
            {user ? (
              <UserMenu user={user} profile={profile} />
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
        </div>
      </div>
    </header>
  )
}

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

async function signOutAction() {
  'use server'

  const supabase = await createClient()
  await supabase.auth.signOut()

  redirect(ROUTES.LOGIN)
}

function UserMenu({ user, profile }: UserMenuProps) {
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
