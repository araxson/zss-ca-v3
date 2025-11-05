'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'

interface SignupFormAlertsProps {
  error?: string | null
}

export function SignupFormAlerts({ error }: SignupFormAlertsProps): React.JSX.Element | null {
  if (!error) {
    return null
  }

  return (
    <Alert variant="destructive" aria-live="assertive">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
