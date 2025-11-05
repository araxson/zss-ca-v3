import { Skeleton } from '@/components/ui/skeleton'

export default function ContactLoading() {
  return (
    <div className="space-y-12">
      <section className="container space-y-6 py-12">
        <Skeleton className="mx-auto h-12 w-2/3" />
        <Skeleton className="mx-auto h-6 w-3/4" />
      </section>

      <section className="container py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </section>
    </div>
  )
}
