import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { Item } from '@/components/ui/item'

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
        'border-0 bg-transparent shadow-none flex-col gap-4',
        isCenter ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-full gap-4',
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
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {kicker}
                </p>
              )
            ) : null}
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            {description ? (
              <p
                className={cn(
                  'text-muted-foreground text-base sm:text-lg',
                  isCenter ? 'max-w-2xl text-balance' : 'max-w-2xl',
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div
            className={cn(
              'flex w-full',
              isCenter ? 'justify-center' : 'sm:w-auto sm:justify-end',
            )}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </Item>
  )
}
