'use client'

import { Item } from '@/components/ui/item'
import { Skeleton } from '@/components/ui/skeleton'

interface AuthFormSkeletonProps {
  ariaLabel: string
  formRows?: number
  showSecondaryPanel?: boolean
}

export function AuthFormSkeleton({
  ariaLabel,
  formRows = 2,
  showSecondaryPanel = true,
}: AuthFormSkeletonProps): React.JSX.Element {
  return (
    <div role="status" aria-live="polite" aria-atomic="true" aria-label={ariaLabel}>
      <Item variant="outline" className="overflow-hidden bg-card max-w-7xl w-full">
        <div className="grid p-0 md:grid-cols-2 gap-0 w-full">
          <div className="space-y-6 p-6 md:p-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: formRows }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>

            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-40" />
          </div>

          {showSecondaryPanel ? (
            <div className="bg-muted relative hidden md:flex items-center justify-center p-8">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
          ) : null}
        </div>
      </Item>
      <span className="sr-only">{ariaLabel}</span>
    </div>
  )
}
