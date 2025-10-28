'use client'

import { useRouter } from 'next/navigation'
import { Bell, LifeBuoy, ScrollText, UserCog, Users as UsersIcon, Globe, Plus } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
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
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>Quick Actions</ItemTitle>
        <ItemDescription>
          Common administrative tasks. Press{' '}
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <span>+</span>
            <Kbd>K</Kbd>
          </KbdGroup>{' '}
          to open global search.
        </ItemDescription>
      </ItemContent>
      <ItemContent>
        <ButtonGroup aria-label="Primary admin actions">
          <Button onClick={() => router.push(ROUTES.ADMIN_CLIENTS)}>
            Manage Clients
          </Button>
          <Button variant="outline" onClick={() => router.push(ROUTES.ADMIN_SITES)}>
            View Sites
          </Button>
          <Button variant="outline" onClick={() => router.push(ROUTES.ADMIN_SITES_NEW)}>
            <Plus className="mr-2 size-4" />
            New Site
          </Button>
        </ButtonGroup>
      </ItemContent>
      <ItemSeparator />
      <ItemContent>
        <Command aria-label="Admin quick navigation">
          <CommandList>
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
      </ItemContent>
    </Item>
  )
}
