import { PageHeaderSkeleton, StatCardsSkeleton } from '@/components/layout/shared'
import { Skeleton } from '@/components/ui/skeleton'

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <StatCardsSkeleton count={4} />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
