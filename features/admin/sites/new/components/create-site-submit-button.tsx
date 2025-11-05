'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function CreateSiteSubmitButton(): React.JSX.Element {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? (
        <>
          <span className="sr-only">Creating site, please wait</span>
          <span aria-hidden="true" className="flex items-center gap-2">
            <Spinner className="size-4" />
            Creating Site...
          </span>
        </>
      ) : (
        'Create Site'
      )}
    </Button>
  )
}
