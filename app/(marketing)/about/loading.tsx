import { Skeleton } from '@/components/ui/skeleton'

export default function AboutLoading() {
  return (
    <div className="space-y-12">
      <section className="container space-y-6 py-12">
        <Skeleton className="mx-auto h-12 w-2/3" />
        <Skeleton className="mx-auto h-6 w-3/4" />
      </section>

      <section className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </section>
    </div>
  )
}
