'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { PasswordStrengthResult } from '@/lib/utils/password-strength'
import { getPasswordStrengthPercentage } from '@/lib/utils/password-strength'
import { cn } from '@/lib/utils/index'

interface PasswordStrengthIndicatorProps {
  id: string
  result: PasswordStrengthResult
  className?: string
}

const VARIANT_MAP: Record<PasswordStrengthResult['strength'], 'destructive' | 'secondary' | 'default'> = {
  weak: 'destructive',
  fair: 'secondary',
  good: 'default',
  strong: 'default',
}

export function PasswordStrengthIndicator({
  id,
  result,
  className,
}: PasswordStrengthIndicatorProps): React.JSX.Element {
  const value = getPasswordStrengthPercentage(result.score)
  const variant = VARIANT_MAP[result.strength]

  return (
    <div id={id} className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Password strength</span>
        <Badge variant={variant}>{result.label}</Badge>
      </div>
      <Progress
        value={value}
        aria-label={`Password strength: ${result.label}`}
        className={cn(
          '[&>div]:transition-colors',
          result.strength === 'weak' && '[&>div]:bg-destructive',
          result.strength === 'fair' && '[&>div]:bg-orange-500 dark:[&>div]:bg-orange-600',
          result.strength === 'good' && '[&>div]:bg-yellow-500 dark:[&>div]:bg-yellow-600',
          result.strength === 'strong' && '[&>div]:bg-green-500 dark:[&>div]:bg-green-600',
        )}
      />
    </div>
  )
}
