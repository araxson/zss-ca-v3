import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ROUTES } from '@/lib/constants/routes'
import { Home, Globe, HelpCircle, Settings } from 'lucide-react'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const sidebarSections = [
    {
      items: [
        { title: 'Dashboard', url: ROUTES.CLIENT_DASHBOARD, icon: <Home /> },
        { title: 'My Sites', url: '/client/sites', icon: <Globe /> },
        { title: 'Support', url: '/client/support', icon: <HelpCircle /> },
      ],
    },
    {
      title: 'Account',
      items: [
        { title: 'Profile', url: '/client/profile', icon: <Settings /> },
      ],
    },
  ]

  return (
    <DashboardLayout
      role="client"
      sidebarSections={sidebarSections}
      breadcrumbHomeHref={ROUTES.CLIENT_DASHBOARD}
      breadcrumbHomeLabel="Overview"
    >
      {children}
    </DashboardLayout>
  )
}
