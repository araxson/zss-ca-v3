'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function SubmitButton(): React.JSX.Element {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner aria-label="Creating site..." /> : 'Create Site'}
    </Button>
  )
}
