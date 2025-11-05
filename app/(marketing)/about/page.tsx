import { AboutPage, aboutPageMetadata } from '@/features/marketing/about'

export const metadata = aboutPageMetadata

// Force static generation for marketing page (Next.js 15+)
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate daily

export default function Page() {
  return <AboutPage />
}
