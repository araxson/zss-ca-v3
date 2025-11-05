'use client'

import { useRouter } from 'next/navigation'
import { Bell, LifeBuoy, ScrollText, UserCog, Users as UsersIcon, Globe } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { ROUTES } from '@/lib/constants/routes'

export function AdminCommandSearch(): React.JSX.Element {
  const router = useRouter()

  return (
    <Command aria-label="Admin quick navigation">
      <CommandInput placeholder="Search actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Management">
          <CommandItem
            value="admin-clients"
            onSelect={() => router.push(ROUTES.ADMIN_CLIENTS)}
            aria-label="Go to clients"
          >
            <UsersIcon className="mr-2 size-4" />
            <span>Manage Clients</span>
          </CommandItem>
          <CommandItem
            value="admin-sites"
            onSelect={() => router.push(ROUTES.ADMIN_SITES)}
            aria-label="Go to sites"
          >
            <Globe className="mr-2 size-4" />
            <span>View Sites</span>
          </CommandItem>
          <CommandItem
            value="admin-support"
            onSelect={() => router.push(ROUTES.ADMIN_SUPPORT)}
            aria-label="Go to support"
          >
            <LifeBuoy className="mr-2 size-4" />
            <span>Support</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Operations">
          <CommandItem
            value="admin-audit-logs"
            onSelect={() => router.push(ROUTES.ADMIN_AUDIT_LOGS)}
            aria-label="Go to audit logs"
          >
            <ScrollText className="mr-2 size-4" />
            <span>Audit Logs</span>
          </CommandItem>
          <CommandItem
            value="admin-profile"
            onSelect={() => router.push(ROUTES.ADMIN_PROFILE)}
            aria-label="Go to profile"
          >
            <UserCog className="mr-2 size-4" />
            <span>Profile</span>
          </CommandItem>
          <CommandItem
            value="admin-notifications"
            onSelect={() => router.push(ROUTES.ADMIN_NOTIFICATIONS)}
            aria-label="Go to notifications"
          >
            <Bell className="mr-2 size-4" />
            <span>Notifications</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
