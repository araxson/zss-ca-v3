'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'

interface ResetPasswordFormAlertsProps {
  error?: string | null
}

export function ResetPasswordFormAlerts({ error }: ResetPasswordFormAlertsProps): React.JSX.Element | null {
  if (!error) {
    return null
  }

  return (
    <Alert variant="destructive" aria-live="assertive">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
