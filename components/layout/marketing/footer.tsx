import 'server-only'

import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { ROUTES } from '@/lib/constants'
import { siteConfig, FOOTER_NAVIGATION } from '@/lib/config'

export async function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div>
              <Link
                href={ROUTES.HOME}
                className="text-lg font-semibold tracking-tight transition-colors hover:text-foreground/80"
                aria-label="Go to homepage"
              >
                {siteConfig.name}
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                {siteConfig.description}
              </p>
            </div>
          </div>

          <nav aria-label="Product links">
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_NAVIGATION.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account links">
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_NAVIGATION.account.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal links">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_NAVIGATION.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {siteConfig.contact.address.city}, {siteConfig.contact.address.region}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
