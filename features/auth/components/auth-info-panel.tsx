'use client'

import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils/index'

interface AuthInfoPanelProps {
  badge?: string
  title: string
  description?: string
  items?: string[]
  footer?: ReactNode
}

export function AuthInfoPanel({
  badge,
  title,
  description,
  items,
  footer,
}: AuthInfoPanelProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-start gap-4 text-left">
      {badge ? (
        <Badge variant="secondary" className="uppercase tracking-wide">
          {badge}
        </Badge>
      ) : null}

      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground text-left">{description}</p>
        ) : null}
      </div>

      {items && items.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-left">
              <CheckCircle2 className={cn('size-4 text-green-500', 'mt-[2px]')} aria-hidden="true" />
              <span className="text-left text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {footer}
    </div>
  )
}
