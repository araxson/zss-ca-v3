'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Users,
  Globe,
  LifeBuoy,
  Bell,
  FileText,
  User,
  ChevronUp,
  LogOut,
  Settings,
  Building,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profile']['Row']

const mainItems = [
  {
    title: 'Dashboard',
    url: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: 'Clients',
    url: ROUTES.ADMIN_CLIENTS,
    icon: Users,
  },
  {
    title: 'Sites',
    url: ROUTES.ADMIN_SITES,
    icon: Globe,
  },
  {
    title: 'Support Tickets',
    url: ROUTES.ADMIN_SUPPORT,
    icon: LifeBuoy,
  },
  {
    title: 'Notifications',
    url: ROUTES.ADMIN_NOTIFICATIONS,
    icon: Bell,
  },
]

const systemItems = [
  {
    title: 'Audit Logs',
    url: ROUTES.ADMIN_AUDIT_LOGS,
    icon: FileText,
  },
]

interface AdminAppSidebarProps {
  profile: Profile | null
  pendingTickets?: number
}

export function AdminAppSidebar({ profile, pendingTickets = 0 }: AdminAppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push(ROUTES.LOGIN)
  }

  const initials = React.useMemo(() => {
    if (!profile?.contact_name) return 'A'
    const names = profile.contact_name.split(' ')
    return names
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [profile])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <div className="font-semibold">Admin Portal</div>
                  <div className="text-xs">ZSS Web Design</div>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const isActive = pathname.startsWith(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <div>{item.title}</div>
                      </Link>
                    </SidebarMenuButton>
                    {item.title === 'Support Tickets' && pendingTickets > 0 && (
                      <SidebarMenuBadge>{pendingTickets}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => {
                const isActive = pathname.startsWith(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <div>{item.title}</div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={profile?.company_website || ''} />
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <div className="truncate font-semibold">
                      {profile?.contact_name || 'Admin'}
                    </div>
                    <div className="truncate text-xs">
                      {profile?.contact_email || ''}
                    </div>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <Item className="px-1 py-1.5">
                    <ItemMedia>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={profile?.company_website || ''} />
                        <AvatarFallback className="rounded-lg">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{profile?.contact_name || 'Admin'}</ItemTitle>
                      <ItemDescription>{profile?.contact_email || ''}</ItemDescription>
                    </ItemContent>
                  </Item>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(ROUTES.ADMIN_PROFILE)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(ROUTES.ADMIN_PROFILE)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
