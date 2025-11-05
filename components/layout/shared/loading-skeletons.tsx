import { Skeleton } from '@/components/ui/skeleton'

/**
 * Page header skeleton with title and description
 */
export function PageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-96" />
    </div>
  )
}

/**
 * Stat cards skeleton grid
 * @param count - Number of cards to display (default: 4)
 * @param cols - Responsive column configuration (default: 'md:grid-cols-2 lg:grid-cols-4')
 */
export function StatCardsSkeleton({
  count = 4,
  cols = 'md:grid-cols-2 lg:grid-cols-4'
}: {
  count?: number
  cols?: string
}) {
  return (
    <div className={`grid gap-4 ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  )
}

/**
 * Card grid skeleton
 * @param count - Number of cards to display (default: 3)
 * @param cols - Responsive column configuration (default: 'md:grid-cols-2 lg:grid-cols-3')
 * @param height - Card height class (default: 'h-64')
 */
export function CardGridSkeleton({
  count = 3,
  cols = 'md:grid-cols-2 lg:grid-cols-3',
  height = 'h-64'
}: {
  count?: number
  cols?: string
  height?: string
}) {
  return (
    <div className={`grid gap-6 ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`${height} w-full`} />
      ))}
    </div>
  )
}

/**
 * Table skeleton with search and filter controls
 * @param rows - Number of rows to display (default: 5)
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {/* Search and filter controls */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table rows */}
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  )
}

/**
 * Chart layout skeleton (large content area with sidebar)
 */
export function ChartLayoutSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Skeleton className="h-96 w-full lg:col-span-4" />
      <Skeleton className="h-96 w-full lg:col-span-3" />
    </div>
  )
}

/**
 * Form skeleton
 * @param fields - Number of form fields to display (default: 3)
 */
export function FormSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}

/**
 * Auth page skeleton (centered form layout)
 */
export function AuthPageSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-9 w-48" />
          <Skeleton className="mx-auto h-5 w-64" />
        </div>
        <FormSkeleton fields={3} />
      </div>
    </div>
  )
}

/**
 * Dashboard overview skeleton (full dashboard layout)
 */
export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <StatCardsSkeleton count={4} />
      <ChartLayoutSkeleton />
    </div>
  )
}

/**
 * List page skeleton (header + search + table)
 */
export function ListPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeaderSkeleton />
        <Skeleton className="h-10 w-32" />
      </div>
      <TableSkeleton rows={5} />
    </div>
  )
}
