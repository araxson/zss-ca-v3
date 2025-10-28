'use client'

import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'

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
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify Code'
        )}
      </Button>

      <ButtonGroup className="justify-center gap-0 [&>*:not(:first-child)]:-ml-px">
        {onResend ? (
          <Button
            type="button"
            variant="link"
            onClick={onResend}
            disabled={!canResend || isResending}
            className="text-sm"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Resending...
              </>
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
