'use client'

import { Sidebar } from '@/components/ui/sidebar'
import type { Database } from '@/lib/types/database.types'
import { AdminSidebarHeader } from './admin-sidebar-header'
import { AdminSidebarNavigation } from './admin-sidebar-navigation'
import { AdminSidebarFooter } from './admin-sidebar-footer'

type Profile = Database['public']['Tables']['profile']['Row']

interface AdminAppSidebarProps {
  profile: Profile | null
  pendingTickets?: number
}

export function AdminAppSidebar({ profile, pendingTickets = 0 }: AdminAppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <AdminSidebarHeader />
      <AdminSidebarNavigation pendingTickets={pendingTickets} />
      <AdminSidebarFooter profile={profile} />
    </Sidebar>
  )
}
