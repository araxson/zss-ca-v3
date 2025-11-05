import { CaseStudiesPage, caseStudiesPageMetadata } from '@/features/marketing/case-studies'

export const metadata = caseStudiesPageMetadata

// Force static generation for case studies page (Next.js 15+)
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate daily

export default function Page() {
  return <CaseStudiesPage />
}
