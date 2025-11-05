'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { siteConfig, MARKETING_NAV_ITEMS } from '@/lib/config'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'

interface HeaderMobileMenuProps {
  user?: { email?: string } | null
  profile?: Database['public']['Tables']['profile']['Row'] | null
  portalLink?: { label: string; href: string } | null
}

export function HeaderMobileMenu({ user, profile, portalLink }: HeaderMobileMenuProps) {
  return (
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
          <SheetDescription>Navigation menu</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-6">
          <nav className="flex flex-col gap-2">
            {MARKETING_NAV_ITEMS.map((item) => (
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
  )
}
