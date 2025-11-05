'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface AuthSubmitButtonProps {
  label: string
  loadingLabel?: string
  disabled?: boolean
}

export function AuthSubmitButton({
  label,
  loadingLabel = `${label}...`,
  disabled = false,
}: AuthSubmitButtonProps): React.JSX.Element {
  const { pending } = useFormStatus()
  const isDisabled = pending || disabled

  return (
    <Button type="submit" className="w-full" disabled={isDisabled} aria-busy={pending}>
      {pending ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span className="sr-only">{loadingLabel}</span>
          <Spinner aria-hidden="true" className="size-4" />
          <span aria-hidden="true" className="text-sm font-medium">
            {loadingLabel}
          </span>
        </span>
      ) : (
        label
      )}
    </Button>
  )
}
