'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function ContactFormSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending} aria-busy={pending}>
      {pending ? (
        <>
          <span className="sr-only">Sending your message, please wait</span>
          <span aria-hidden="true" className="flex items-center justify-center gap-2">
            <Spinner className="size-4" />
            Sending
          </span>
        </>
      ) : (
        'Send message'
      )}
    </Button>
  )
}
