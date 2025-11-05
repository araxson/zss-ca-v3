'use client'

import { Link2 } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'

interface DeploySiteUrlFieldNativeProps {
  errors?: Record<string, string[]>
  isPending: boolean
  defaultValue?: string
}

export function DeploySiteUrlFieldNative({ errors, isPending, defaultValue }: DeploySiteUrlFieldNativeProps): React.JSX.Element {
  const cleanDefaultValue = defaultValue?.replace(/^https?:\/\//i, '') ?? ''

  return (
    <Field>
      <FieldLabel htmlFor="deployment_url">Deployment URL</FieldLabel>
      <FieldDescription>The live URL where the site is now accessible</FieldDescription>
      <InputGroup>
        <InputGroupInput
          id="deployment_url"
          name="deployment_url"
          placeholder="example.com"
          className="!pl-1"
          required
          disabled={isPending}
          defaultValue={cleanDefaultValue}
          aria-invalid={errors?.['deployment_url'] ? 'true' : 'false'}
          aria-describedby={errors?.['deployment_url'] ? 'deployment_url-error' : undefined}
        />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Link2 className="size-4" aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>
      {errors?.['deployment_url'] && (
        <FieldError id="deployment_url-error">{errors['deployment_url'][0]}</FieldError>
      )}
    </Field>
  )
}
