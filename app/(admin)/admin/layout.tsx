import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ROUTES } from '@/lib/constants/routes'
import { Home, Users, Globe, HelpCircle, Settings } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sidebarSections = [
    {
      items: [
        { title: 'Dashboard', url: ROUTES.ADMIN_DASHBOARD, icon: <Home /> },
        { title: 'Clients', url: '/admin/clients', icon: <Users /> },
        { title: 'Sites', url: '/admin/sites', icon: <Globe /> },
        { title: 'Support', url: '/admin/support', icon: <HelpCircle />, badge: 5 },
      ],
    },
    {
      title: 'Settings',
      items: [
        { title: 'Profile', url: '/admin/profile', icon: <Settings /> },
      ],
    },
  ]

  return (
    <DashboardLayout
      role="admin"
      sidebarSections={sidebarSections}
      breadcrumbHomeHref={ROUTES.ADMIN_DASHBOARD}
      breadcrumbHomeLabel="Overview"
    >
      {children}
    </DashboardLayout>
  )
}
