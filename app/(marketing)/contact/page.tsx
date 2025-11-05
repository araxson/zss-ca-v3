import { ContactPage, contactPageMetadata } from '@/features/marketing/contact'

export const metadata = contactPageMetadata

// Force static generation for contact page (Next.js 15+)
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate daily

export default function Page() {
  return <ContactPage />
}
