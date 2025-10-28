import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemActions,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

interface SectionHeaderProps {
  title: string
  description?: string
  align?: 'start' | 'center'
  kicker?: string
  kickerVariant?: 'text' | 'badge'
  className?: string
  leading?: ReactNode
  actions?: ReactNode
}

export function SectionHeader({
  title,
  description,
  align = 'center',
  kicker,
  kickerVariant = 'text',
  className,
  leading,
  actions,
}: SectionHeaderProps) {
  const isCenter = align === 'center'

  return (
    <Item
      className={cn(
        'border-0 bg-transparent shadow-none',
        isCenter ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <ItemHeader
        className={cn(
          'w-full gap-4',
          isCenter ? 'flex-col items-center' : 'flex-col sm:flex-row sm:items-center sm:justify-between',
        )}
      >
        <div
          className={cn(
            'flex w-full gap-3',
            leading
              ? isCenter
                ? 'flex-col items-center'
                : 'flex-col sm:flex-row sm:items-center'
              : isCenter
                ? 'flex-col items-center'
                : 'flex-col',
          )}
        >
          {leading ? (
            <div
              className={cn(
                'flex',
                isCenter ? 'justify-center' : 'sm:self-start',
              )}
            >
              {leading}
            </div>
          ) : null}
          <div
            className={cn(
              'flex flex-col gap-3',
              isCenter ? 'items-center text-center' : 'items-start text-left',
            )}
          >
            {kicker ? (
              kickerVariant === 'badge' ? (
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  {kicker}
                </span>
              ) : (
                <ItemDescription className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {kicker}
                </ItemDescription>
              )
            ) : null}
            <ItemTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </ItemTitle>
            {description ? (
              <ItemContent className="max-w-2xl">
                <ItemDescription className="text-base sm:text-lg text-muted-foreground">
                  {description}
                </ItemDescription>
              </ItemContent>
            ) : null}
          </div>
        </div>
        {actions ? (
          <ItemActions
            className={cn(
              'w-full',
              isCenter ? 'justify-center' : 'sm:w-auto sm:justify-end',
            )}
          >
            {actions}
          </ItemActions>
        ) : null}
      </ItemHeader>
    </Item>
  )
}
