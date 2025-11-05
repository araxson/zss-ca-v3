import { TermsPage, termsPageMetadata } from '@/features/marketing/terms'

export const metadata = termsPageMetadata

// Force static generation for terms page (Next.js 15+)
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate daily

export default function Terms() {
  return <TermsPage />
}
