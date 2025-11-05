import { Skeleton } from '@/components/ui/skeleton'
import { Item, ItemContent, ItemHeader, ItemTitle, ItemDescription } from '@/components/ui/item'

export default function SitesListLoading(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Item key={index} variant="outline" className="p-4 space-y-3">
            <ItemHeader className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20" />
            </ItemHeader>
            <ItemContent className="space-y-2">
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-3/4" />
            </ItemContent>
          </Item>
        ))}
      </div>

      <Item variant="outline" className="p-4 space-y-4">
        <ItemHeader>
          <ItemTitle>
            <Skeleton className="h-5 w-32" />
          </ItemTitle>
          <ItemDescription>
            <Skeleton className="h-4 w-64" />
          </ItemDescription>
        </ItemHeader>
        <ItemContent className="space-y-3">
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-10 w-full" />
        </ItemContent>
      </Item>

      <div className="rounded-md border">
        <div className="grid gap-3 p-4 md:grid-cols-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="border-t" />
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid gap-3 p-4 sm:grid-cols-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
