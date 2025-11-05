'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Rocket } from 'lucide-react'

export function DeploySiteSubmitButton(): React.JSX.Element {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? (
        <>
          <Spinner />
          <span className="ml-2">Deploying...</span>
        </>
      ) : (
        <>
          <Rocket className="mr-2 size-4" aria-hidden="true" />
          Deploy Site
        </>
      )}
    </Button>
  )
}
