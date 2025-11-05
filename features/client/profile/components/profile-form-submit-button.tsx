'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function SubmitButton(): React.JSX.Element {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? (
        <>
          <span className="sr-only">Saving your profile, please wait</span>
          <span aria-hidden="true" className="flex items-center gap-2">
            <Spinner className="size-4" />
            Saving...
          </span>
        </>
      ) : (
        'Save Changes'
      )}
    </Button>
  )
}
