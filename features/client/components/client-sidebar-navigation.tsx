'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Globe,
  CreditCard,
  LifeBuoy,
  Bell,
  User,
} from 'lucide-react'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ROUTES } from '@/lib/constants/routes'

const mainItems = [
  {
    title: 'Dashboard',
    url: ROUTES.CLIENT_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: 'My Sites',
    url: ROUTES.CLIENT_SITES,
    icon: Globe,
  },
  {
    title: 'Subscription',
    url: ROUTES.CLIENT_SUBSCRIPTION,
    icon: CreditCard,
  },
  {
    title: 'Support',
    url: ROUTES.CLIENT_SUPPORT,
    icon: LifeBuoy,
  },
  {
    title: 'Notifications',
    url: ROUTES.CLIENT_NOTIFICATIONS,
    icon: Bell,
  },
]

const bottomItems = [
  {
    title: 'Profile',
    url: ROUTES.CLIENT_PROFILE,
    icon: User,
  },
]

export function ClientSidebarNavigation() {
  const pathname = usePathname()

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainItems.map((item) => {
              const isActive = pathname.startsWith(item.url)
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {bottomItems.map((item) => {
              const isActive = pathname.startsWith(item.url)
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
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
