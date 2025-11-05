import { PageHeaderSkeleton, CardGridSkeleton } from '@/components/layout/shared'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <CardGridSkeleton count={3} cols="md:grid-cols-2 lg:grid-cols-3" />
    </div>
  )
}
