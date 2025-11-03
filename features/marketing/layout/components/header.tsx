import Link from 'next/link'
import { Menu } from 'lucide-react'

import { navigationMenuTriggerStyle, NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ROUTES } from '@/lib/constants/routes'
import { siteConfig } from '@/lib/config/site.config'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { UserMenu } from './user-menu'

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
