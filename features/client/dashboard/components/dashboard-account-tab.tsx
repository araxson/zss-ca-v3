import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Database } from '@/lib/types/database.types'
import { ROUTES } from '@/lib/constants/routes'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Bell, CreditCard, Globe, LifeBuoy } from 'lucide-react'

type Profile = Database['public']['Tables']['profile']['Row'] | null

interface DashboardAccountTabProps {
  profile: Profile
  onNavigate: (path: string) => void
}

export function DashboardAccountTab({ profile, onNavigate }: DashboardAccountTabProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="space-y-2">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Name</dt>
              <dd className="font-medium">{profile?.contact_name ?? '—'}</dd>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="font-medium">{profile?.contact_email ?? '—'}</dd>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Company</dt>
              <dd className="font-medium">{profile?.company_name ?? '—'}</dd>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Phone</dt>
              <dd className="font-medium">{profile?.contact_phone ?? '—'}</dd>
            </div>
          </dl>
          <Button asChild variant="outline" className="w-full">
            <Link href={ROUTES.CLIENT_PROFILE}>Edit Profile</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <Command
            aria-label="Client quick navigation"
            className="w-full rounded-md border"
          >
            <CommandList>
              <CommandGroup heading="Account">
                <CommandItem
                  value="client-sites"
                  onSelect={() => onNavigate(ROUTES.CLIENT_SITES)}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  <span>My Websites</span>
                </CommandItem>
                <CommandItem
                  value="client-subscription"
                  onSelect={() => onNavigate(ROUTES.CLIENT_SUBSCRIPTION)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Subscription</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Support">
                <CommandItem
                  value="client-support"
                  onSelect={() => onNavigate(ROUTES.CLIENT_SUPPORT)}
                >
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </CommandItem>
                <CommandItem
                  value="client-notifications"
                  onSelect={() => onNavigate(ROUTES.CLIENT_NOTIFICATIONS)}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CardContent>
      </Card>
    </>
  )
}
