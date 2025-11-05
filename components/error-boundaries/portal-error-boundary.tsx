'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface PortalErrorConfig {
  portal: 'admin' | 'client' | 'marketing' | 'auth'
  icon: LucideIcon
  title?: string
  description?: string
  primaryAction?: {
    label: string
    href: string
  }
  secondaryActions?: readonly {
    label: string
    href: string
    variant?: 'default' | 'outline' | 'ghost'
  }[]
  quickLinks?: readonly {
    label: string
    href: string
    icon?: LucideIcon
  }[]
}

export function createPortalErrorBoundary(config: PortalErrorConfig) {
  return function PortalErrorBoundary({
    error,
    reset,
  }: {
    error: Error & { digest?: string }
    reset: () => void
  }) {
    const router = useRouter()

    useEffect(() => {
      console.error(`[${config.portal}] error:`, error)
    }, [error])

    const Icon = config.icon

    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon className="h-12 w-12" />
            </EmptyMedia>
            <EmptyTitle>
              {config.title || 'Something went wrong'}
            </EmptyTitle>
            <EmptyDescription>
              {config.description ||
                'An unexpected error occurred. Please try again.'}
            </EmptyDescription>
            {error.digest && (
              <p className="text-muted-foreground text-sm">
                Error reference: {error.digest}
              </p>
            )}
          </EmptyHeader>
          <EmptyContent className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Button onClick={() => reset()}>Try again</Button>
              {config.primaryAction && (
                <Button
                  variant="outline"
                  onClick={() => router.push(config.primaryAction!.href)}
                >
                  {config.primaryAction.label}
                </Button>
              )}
            </div>
            {config.secondaryActions && (
              <div className="flex flex-wrap gap-2 justify-center">
                {config.secondaryActions.map((action) => (
                  <Button
                    key={action.href}
                    variant={action.variant || 'outline'}
                    size="sm"
                    onClick={() => router.push(action.href)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
            {config.quickLinks && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                {config.quickLinks.map((link) => {
                  const LinkIcon = link.icon
                  return (
                    <Button
                      key={link.href}
                      variant="outline"
                      size="sm"
                      className="h-auto flex-col gap-2 py-4"
                      onClick={() => router.push(link.href)}
                    >
                      {LinkIcon && <LinkIcon className="h-5 w-5" />}
                      {link.label}
                    </Button>
                  )
                })}
              </div>
            )}
          </EmptyContent>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 max-w-2xl">
              <summary className="cursor-pointer text-sm font-medium">
                Error details (development only)
              </summary>
              <pre className="mt-2 overflow-auto rounded-lg bg-muted p-4 text-xs">
                {error.stack}
              </pre>
            </details>
          )}
        </Empty>
      </div>
    )
  }
}
