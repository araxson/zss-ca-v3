'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  CreditCard,
  FileText,
  Globe,
  HelpCircle,
  Home,
  LineChart,
  PlusCircle,
  SearchIcon,
  Settings,
  User,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ROUTES } from '@/lib/constants/routes'

interface DashboardUser {
  name: string
  email: string
  avatar?: string
}

interface SearchProps {
  role: 'admin' | 'client'
  user: DashboardUser
}

interface CommandLink {
  label: string
  href: string
  icon: LucideIcon
}

function getInitials(name: string, email: string): string {
  if (name) {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2)
  }

  return email.slice(0, 2).toUpperCase()
}

export function Search({ role, user }: SearchProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const notificationsRoute =
    role === 'admin' ? ROUTES.ADMIN_NOTIFICATIONS : ROUTES.CLIENT_NOTIFICATIONS
  const settingsRoute = role === 'admin' ? ROUTES.ADMIN_SETTINGS : ROUTES.CLIENT_PROFILE
  const profileRoute = role === 'admin' ? ROUTES.ADMIN_PROFILE : ROUTES.CLIENT_PROFILE

  const navigationItems: CommandLink[] =
    role === 'admin'
      ? [
          { label: 'Dashboard', href: ROUTES.ADMIN_DASHBOARD, icon: Home },
          { label: 'Clients', href: ROUTES.ADMIN_CLIENTS, icon: Users },
          { label: 'Sites', href: ROUTES.ADMIN_SITES, icon: Globe },
          { label: 'Support', href: ROUTES.ADMIN_SUPPORT, icon: HelpCircle },
          { label: 'Analytics', href: ROUTES.ADMIN_ANALYTICS, icon: LineChart },
        ]
      : [
          { label: 'Overview', href: ROUTES.CLIENT_DASHBOARD, icon: Home },
          { label: 'Websites', href: ROUTES.CLIENT_SITES, icon: Globe },
          { label: 'Support', href: ROUTES.CLIENT_SUPPORT, icon: HelpCircle },
          { label: 'Subscription', href: ROUTES.CLIENT_SUBSCRIPTION, icon: CreditCard },
        ]

  const actionItems: CommandLink[] =
    role === 'admin'
      ? [
          { label: 'View Support Tickets', href: ROUTES.ADMIN_SUPPORT, icon: FileText },
          { label: 'Create New Site', href: ROUTES.ADMIN_SITES_NEW, icon: Globe },
          { label: 'View Notifications', href: notificationsRoute, icon: Bell },
        ]
      : [
          { label: 'Update Profile', href: ROUTES.CLIENT_PROFILE, icon: User },
          { label: 'Manage Subscription', href: ROUTES.CLIENT_SUBSCRIPTION, icon: CreditCard },
          { label: 'New Support Ticket', href: ROUTES.CLIENT_SUPPORT_NEW, icon: PlusCircle },
        ]

  const initials = getInitials(user.name, user.email)

  const handleSelect = (href: string) => {
    setOpen(false)
    setValue('')
    router.push(href)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setValue('')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleNotificationsClick = () => {
    router.push(notificationsRoute)
  }

  const handleSettingsClick = () => {
    router.push(settingsRoute)
  }

  const handleProfileClick = () => {
    router.push(profileRoute)
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <form onSubmit={handleSubmit} className="flex-1 sm:flex-none">
          <ButtonGroup className="w-full sm:w-[260px] lg:w-[320px]">
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Search..."
              aria-label="Search"
              autoComplete="off"
              className="w-full"
            />
            <Button type="submit" variant="outline" aria-label="Open search results">
              <SearchIcon className="size-4" />
            </Button>
          </ButtonGroup>
        </form>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="View notifications"
            onClick={handleNotificationsClick}
          >
            <Bell className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open settings"
            onClick={handleSettingsClick}
          >
            <Settings className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full p-0"
            aria-label="Open profile"
            onClick={handleProfileClick}
          >
            <Avatar className="size-8">
              {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput
          value={value}
          onValueChange={setValue}
          placeholder="Type to search..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigation">
            {navigationItems.map(({ label, href, icon: Icon }) => (
              <CommandItem
                key={href}
                value={label}
                onSelect={() => handleSelect(href)}
                className="cursor-pointer"
              >
                <Icon className="mr-2 size-4" />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>

          {actionItems.length > 0 ? (
            <CommandGroup heading="Quick Actions">
              {actionItems.map(({ label, href, icon: Icon }) => (
                <CommandItem
                  key={href}
                  value={label}
                  onSelect={() => handleSelect(href)}
                  className="cursor-pointer"
                >
                  <Icon className="mr-2 size-4" />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  )
}
