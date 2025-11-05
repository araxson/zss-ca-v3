import { ResourcesPage, resourcesPageMetadata } from '@/features/marketing/resources'

export const metadata = resourcesPageMetadata

// ISR for resources page (Next.js 15+)
// Resources may be updated frequently, so we use ISR
export const revalidate = 3600 // Revalidate every hour

export default function Page() {
  return <ResourcesPage />
}
