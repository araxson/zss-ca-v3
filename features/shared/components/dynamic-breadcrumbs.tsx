'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface DynamicBreadcrumbsProps {
  homeHref: string
  homeLabel: string
}

export function DynamicBreadcrumbs({ homeHref, homeLabel }: DynamicBreadcrumbsProps) {
  const pathname = usePathname()

  // Parse the pathname into segments
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .slice(1) // Remove the portal prefix (admin/client)

  // Format segment to readable label
  const formatLabel = (segment: string): string => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // If we're on the home page, show minimal breadcrumb
  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{homeLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={homeHref}>
            {homeLabel}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          const href = `${homeHref}/${segments.slice(0, index + 1).join('/')}`
          const label = formatLabel(segment)

          return (
            <div key={segment} className="flex items-center gap-2">
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="line-clamp-1 max-w-40 sm:max-w-60">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} className="hidden lg:block">
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
