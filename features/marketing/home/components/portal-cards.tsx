import Link from 'next/link'
import { ArrowRight, Building2, ClipboardList, LayoutDashboard } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { ROUTES } from '@/lib/constants/routes'

export function PortalCards() {
  return (
    <Card className="max-w-4xl w-full">
      <CardHeader className="space-y-2">
        <CardTitle>Choose your workspace</CardTitle>
        <CardDescription>
          Navigate directly to the portal or learn more about how the platform works.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Command className="rounded-lg border">
          <CommandList>
            <CommandGroup heading="Portals">
              <CommandItem asChild>
                <Link href={ROUTES.CLIENT_DASHBOARD} className="flex w-full items-center justify-between">
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    Client Portal
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CommandItem>
              <CommandItem asChild>
                <Link href={ROUTES.ADMIN_DASHBOARD} className="flex w-full items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    Admin Portal
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Company">
              <CommandItem asChild>
                <Link href={ROUTES.ABOUT} className="flex w-full items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    About Our Team
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CardContent>
    </Card>
  )
}
