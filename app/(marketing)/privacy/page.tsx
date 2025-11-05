import { PrivacyPage, privacyPageMetadata } from '@/features/marketing/privacy'

export const metadata = privacyPageMetadata

// Force static generation for privacy page (Next.js 15+)
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate daily

export default function Privacy() {
  return <PrivacyPage />
}
