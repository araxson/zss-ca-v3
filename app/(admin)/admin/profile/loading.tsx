import { PageHeaderSkeleton, FormSkeleton } from '@/components/layout/shared'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="grid gap-6 md:grid-cols-2">
        <FormSkeleton fields={3} />
        <FormSkeleton fields={3} />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  )
}
