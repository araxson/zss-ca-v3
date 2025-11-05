'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { AuthSubmitButton } from '@/features/auth/components/auth-submit-button'

interface OTPFormActionsProps {
  isResending: boolean
  canResend: boolean
  resendTimer: number
  onResend?: () => Promise<void>
}

export function OTPFormActions({
  isResending,
  canResend,
  resendTimer,
  onResend,
}: OTPFormActionsProps) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <AuthSubmitButton label="Verify code" loadingLabel="Verifying code" />

      <ButtonGroup className="mx-auto">
        {onResend ? (
          <Button
            type="button"
            variant="link"
            onClick={onResend}
            disabled={!canResend || isResending}
            className="text-sm"
          >
            {isResending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="size-3.5" aria-hidden="true" />
                <span aria-hidden="true">Resending...</span>
              </span>
            ) : (
              'Resend Code'
            )}
          </Button>
        ) : null}
        <Button type="button" variant="link" onClick={() => router.back()} className="text-sm">
          Go Back
        </Button>
      </ButtonGroup>

      {onResend && !canResend ? (
        <p className="text-center text-sm text-muted-foreground">
          Resend code in {resendTimer} seconds
        </p>
      ) : null}
    </div>
  )
}
