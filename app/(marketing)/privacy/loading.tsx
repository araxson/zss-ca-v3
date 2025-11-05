import { Skeleton } from '@/components/ui/skeleton'

export default function PrivacyLoading() {
  return (
    <div className="container max-w-4xl space-y-8 py-12">
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-3/4" />
    </div>
  )
}
