import { Skeleton } from '@/components/ui/skeleton'

export default function MarketingLoading() {
  return (
    <div className="space-y-12">
      <section className="container space-y-6 py-12">
        <Skeleton className="mx-auto h-12 w-3/4" />
        <Skeleton className="mx-auto h-6 w-2/3" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </section>

      <section className="container space-y-6 py-12">
        <Skeleton className="h-96 w-full" />
      </section>
    </div>
  )
}
