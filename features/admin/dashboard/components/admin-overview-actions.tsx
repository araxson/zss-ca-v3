'use client'

import { useRouter } from 'next/navigation'
import { Bell, LifeBuoy, ScrollText, UserCog, Users as UsersIcon, Globe } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { ROUTES } from '@/lib/constants/routes'

export function AdminOverviewActions() {
  const router = useRouter()

  return (
    <Item variant="outline" className="flex h-full flex-col">
      <ItemHeader className="gap-1">
        <ItemTitle>Quick Actions</ItemTitle>
        <ItemDescription>Common administrative tasks</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <Command
          aria-label="Admin quick navigation"
          className="w-full rounded-md border"
        >
          <CommandList>
            <CommandGroup heading="Management">
              <CommandItem
                value="admin-clients"
                onSelect={() => router.push(ROUTES.ADMIN_CLIENTS)}
              >
                <UsersIcon className="mr-2 h-4 w-4" />
                <span>Manage Clients</span>
              </CommandItem>
              <CommandItem
                value="admin-sites"
                onSelect={() => router.push(ROUTES.ADMIN_SITES)}
              >
                <Globe className="mr-2 h-4 w-4" />
                <span>View Sites</span>
              </CommandItem>
              <CommandItem
                value="admin-support"
                onSelect={() => router.push(ROUTES.ADMIN_SUPPORT)}
              >
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Operations">
              <CommandItem
                value="admin-audit-logs"
                onSelect={() => router.push(ROUTES.ADMIN_AUDIT_LOGS)}
              >
                <ScrollText className="mr-2 h-4 w-4" />
                <span>Audit Logs</span>
              </CommandItem>
              <CommandItem
                value="admin-profile"
                onSelect={() => router.push(ROUTES.ADMIN_PROFILE)}
              >
                <UserCog className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </CommandItem>
              <CommandItem
                value="admin-notifications"
                onSelect={() => router.push(ROUTES.ADMIN_NOTIFICATIONS)}
              >
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </ItemContent>
    </Item>
  )
}
