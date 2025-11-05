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
import { formatBreadcrumbLabel } from '@/lib/utils/format'

interface BreadcrumbsProps {
  homeHref: string
  homeLabel: string
}

export function Breadcrumbs({ homeHref, homeLabel }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Parse the pathname into segments
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .slice(1) // Remove the portal prefix (admin/client)

  // If we're on the home page, show minimal breadcrumb
  if (segments.length === 0) {
    return (
      <Breadcrumb aria-label="Page navigation">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{homeLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb aria-label="Page navigation">
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={homeHref}>
            {homeLabel}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          const href = `${homeHref}/${segments.slice(0, index + 1).join('/')}`
          const label = formatBreadcrumbLabel(segment)

          return (
            <div key={`${segment}-${index}`} className="flex items-center gap-2">
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
