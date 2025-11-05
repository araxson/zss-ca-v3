import { Suspense } from 'react'
import { HomePage, homePageMetadata } from '@/features/marketing'

export const metadata = homePageMetadata
export const dynamic = 'force-static'
export const revalidate = 3600

export default function Page() {
  return <Suspense fallback={null}><HomePage /></Suspense>
}
