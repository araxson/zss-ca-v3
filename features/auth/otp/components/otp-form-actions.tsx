'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface OTPFormActionsProps {
  isLoading: boolean
  isResending: boolean
  canResend: boolean
  resendTimer: number
  onResend?: () => Promise<void>
}

export function OTPFormActions({
  isLoading,
  isResending,
  canResend,
  resendTimer,
  onResend,
}: OTPFormActionsProps) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Spinner className="mr-2" /> : null}
        {isLoading ? 'Verifying...' : 'Verify Code'}
      </Button>

      <div
        className="flex justify-center gap-0 [&>*:not(:first-child)]:-ml-px"
        role="group"
      >
        {onResend ? (
          <Button
            type="button"
            variant="link"
            onClick={onResend}
            disabled={!canResend || isResending}
            className="text-sm"
          >
            {isResending ? <Spinner className="mr-2" /> : null}
            {isResending ? 'Resending...' : 'Resend Code'}
          </Button>
        ) : null}
        <Button type="button" variant="link" onClick={() => router.back()} className="text-sm">
          Go Back
        </Button>
      </div>

      {onResend && !canResend ? (
        <p className="text-center text-sm text-muted-foreground">
          Resend code in {resendTimer} seconds
        </p>
      ) : null}
    </div>
  )
}
