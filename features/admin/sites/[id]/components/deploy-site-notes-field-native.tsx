'use client'

import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'

interface DeploySiteNotesFieldNativeProps {
  errors?: Record<string, string[]>
  isPending: boolean
  defaultValue?: string
}

export function DeploySiteNotesFieldNative({ errors, isPending, defaultValue }: DeploySiteNotesFieldNativeProps): React.JSX.Element {
  return (
    <Field>
      <FieldLabel htmlFor="deployment_notes">Deployment Notes (Optional)</FieldLabel>
      <FieldDescription>Internal notes about this deployment</FieldDescription>
      <Textarea
        id="deployment_notes"
        name="deployment_notes"
        placeholder="Any notes about the deployment..."
        className="min-h-20"
        disabled={isPending}
        defaultValue={defaultValue ?? ''}
        aria-invalid={errors?.['deployment_notes'] ? 'true' : 'false'}
        aria-describedby={errors?.['deployment_notes'] ? 'deployment_notes-error' : undefined}
      />
      {errors?.['deployment_notes'] && (
        <FieldError id="deployment_notes-error">{errors['deployment_notes'][0]}</FieldError>
      )}
    </Field>
  )
}
