'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function BulkNotificationSubmitButton(): React.JSX.Element {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? <Spinner /> : 'Send to All Clients'}
    </Button>
  )
}
