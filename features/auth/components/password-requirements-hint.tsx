'use client'

import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

const PASSWORD_REQUIREMENTS = [
  'At least 8 characters',
  'One uppercase letter',
  'One lowercase letter',
  'One number',
]

interface PasswordRequirementsHintProps {
  ariaLabel?: string
}

export function PasswordRequirementsHint({
  ariaLabel = 'Password requirements',
}: PasswordRequirementsHintProps): React.JSX.Element {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground"
          aria-label={ariaLabel}
        >
          <Info className="size-4" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-64 space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Your password should include:
          </p>
          <p className="text-xs text-muted-foreground">
            Meeting all requirements unlocks full account access.
          </p>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {PASSWORD_REQUIREMENTS.map((requirement) => (
            <li key={requirement} className="flex items-center gap-2">
              <Badge variant="outline" className="h-5 px-1.5 text-[11px]">
                ✓
              </Badge>
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
      </HoverCardContent>
    </HoverCard>
  )
}
