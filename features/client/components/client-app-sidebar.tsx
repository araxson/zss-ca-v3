'use client'

import { Sidebar, SidebarRail } from '@/components/ui/sidebar'
import type { Database } from '@/lib/types/database.types'
import { ClientSidebarHeader } from './client-sidebar-header'
import { ClientSidebarNavigation } from './client-sidebar-navigation'
import { ClientSidebarFooter } from './client-sidebar-footer'

type Profile = Database['public']['Tables']['profile']['Row']

interface ClientAppSidebarProps {
  profile: Profile | null
}

export function ClientAppSidebar({ profile }: ClientAppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <ClientSidebarHeader />
      <ClientSidebarNavigation />
      <ClientSidebarFooter profile={profile} />
      <SidebarRail />
    </Sidebar>
  )
}
