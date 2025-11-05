'use client'

import Link from 'next/link'
import { AlertCircle, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants/routes'

interface LoginFormAlertsProps {
  infoMessage: string | null
  state: { error?: string | null } | null
  isRateLimited: boolean
  remainingRateLimitSeconds: number | null
  rateLimitProgress: number
}

const ICON_SIZE = 'size-4'

export function LoginFormAlerts({
  infoMessage,
  state,
  isRateLimited,
  remainingRateLimitSeconds,
  rateLimitProgress,
}: LoginFormAlertsProps): React.JSX.Element | null {
  const blocks: Array<React.ReactNode> = []

  if (infoMessage) {
    blocks.push(
      <Alert key="info">
        <Info className={ICON_SIZE} aria-hidden="true" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>{infoMessage}</AlertDescription>
      </Alert>,
    )
  }

  if (isRateLimited) {
    blocks.push(
      <Empty key="rate-limit" className="border border-dashed bg-muted/40">
        <EmptyHeader>
          <EmptyTitle>Too many attempts</EmptyTitle>
          <EmptyDescription>
            Your account is temporarily locked. Please wait {remainingRateLimitSeconds ?? 0} seconds, or reset your password if
            you need immediate access.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="space-y-3">
          <Progress value={rateLimitProgress} aria-label="Rate limit countdown" />
          <p className="text-xs text-muted-foreground">
            We&apos;ll unlock sign-in automatically when the timer completes.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm">
              <Link href={ROUTES.RESET_PASSWORD}>Reset password</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={ROUTES.PRICING}>Explore plans</Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>,
    )
  } else if (state?.error) {
    blocks.push(
      <Alert key="error" variant="destructive" aria-live="assertive">
        <AlertCircle className={ICON_SIZE} aria-hidden="true" />
        <AlertTitle>Sign in failed</AlertTitle>
        <AlertDescription>{state.error}</AlertDescription>
      </Alert>,
    )
  }

  if (blocks.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div key={index}>{block}</div>
      ))}
    </div>
  )
}
