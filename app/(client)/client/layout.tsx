import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { DashboardLayout } from '@/components/layout'
import { CLIENT_SIDEBAR_SECTIONS } from '@/lib/config'
import { getPageMetadata } from '@/lib/config'
import { ROUTES } from '@/lib/constants'
import { createClient, requireAuth, getUserProfile } from '@/lib/supabase'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const user = await requireAuth(supabase)

  // ✅ Next.js 15+: Must await headers() and createClient()
  // ✅ Parallel data fetching to avoid waterfall
  const [headersList, profile] = await Promise.all([
    headers(), // Get headers (already returns Promise in Next.js 15+)
    getUserProfile(supabase, user.id), // Get user profile
  ])

  const pathname = headersList.get('x-pathname') || ''

  // Get page metadata
  const metadata = getPageMetadata(pathname, 'client')

  return (
    <DashboardLayout
      role="client"
      user={{
        name: profile?.contact_name || user.email?.split('@')[0] || 'Client',
        email: user.email || '',
      }}
      sidebarSections={CLIENT_SIDEBAR_SECTIONS}
      breadcrumbHomeHref={ROUTES.CLIENT_DASHBOARD}
      breadcrumbHomeLabel="Overview"
      pageTitle={metadata?.title}
      pageDescription={metadata?.description}
    >
      {children}
    </DashboardLayout>
  )
}
