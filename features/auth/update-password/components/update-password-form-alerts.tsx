'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'

interface UpdatePasswordFormAlertsProps {
  error?: string | null
}

export function UpdatePasswordFormAlerts({
  error,
}: UpdatePasswordFormAlertsProps): React.JSX.Element | null {
  if (!error) {
    return null
  }

  return (
    <Alert variant="destructive" aria-live="assertive">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
