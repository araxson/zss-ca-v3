import { ServicesPage, servicesPageMetadata } from '@/features/marketing/services'

export const metadata = servicesPageMetadata

// Force static generation for services page (Next.js 15+)
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate daily

export default function Page() {
  return <ServicesPage />
}
