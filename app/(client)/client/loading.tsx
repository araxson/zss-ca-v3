import { PageHeaderSkeleton, StatCardsSkeleton } from '@/components/layout/shared'
import { Skeleton } from '@/components/ui/skeleton'

export default function ClientDashboardLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <StatCardsSkeleton count={3} cols="md:grid-cols-3" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}
