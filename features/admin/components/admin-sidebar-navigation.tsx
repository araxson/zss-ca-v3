'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Globe,
  LifeBuoy,
  Bell,
  FileText,
} from 'lucide-react'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from '@/components/ui/sidebar'
import { ROUTES } from '@/lib/constants/routes'

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

interface AdminSidebarNavigationProps {
  pendingTickets?: number
}

export function AdminSidebarNavigation({ pendingTickets = 0 }: AdminSidebarNavigationProps) {
  const pathname = usePathname()

  return (
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
  )
}
