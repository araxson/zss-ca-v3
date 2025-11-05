import { Skeleton } from '@/components/ui/skeleton'
import { Item, ItemContent, ItemHeader } from '@/components/ui/item'

export default function AdminDashboardLoading(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Item key={index} variant="outline" className="space-y-3 p-4">
            <ItemHeader>
              <Skeleton className="size-10 rounded-full" />
            </ItemHeader>
            <ItemContent className="space-y-3">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-3/4" />
            </ItemContent>
          </Item>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Item key={index} variant="outline" className="space-y-3 p-4">
            <ItemHeader>
              <Skeleton className="h-6 w-32" />
            </ItemHeader>
            <ItemContent>
              <Skeleton className="h-[280px] w-full" />
            </ItemContent>
          </Item>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Item key={index} variant="outline" className="space-y-3 p-4">
            <ItemHeader>
              <Skeleton className="h-6 w-36" />
            </ItemHeader>
            <ItemContent>
              <Skeleton className="h-[220px] w-full" />
            </ItemContent>
          </Item>
        ))}
      </div>
    </div>
  )
}
