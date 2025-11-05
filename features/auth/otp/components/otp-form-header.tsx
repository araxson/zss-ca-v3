import { Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'

interface OTPFormHeaderProps {
  title: string
  description: string
  email: string
  verificationType: string
}

export function OTPFormHeader({
  title,
  description,
  email,
  verificationType,
}: OTPFormHeaderProps) {
  const formattedType = verificationType.replace('_', ' ')

  return (
    <FieldGroup className="gap-4">
      <Field className="items-center text-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground text-sm text-balance">{description}</p>
      </Field>
      <Field className="gap-3">
        <FieldLabel>Verification email</FieldLabel>
        <div className="flex items-center justify-between rounded-md border bg-background px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-muted">
              <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
            </span>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium">{email}</span>
              <span className="text-xs text-muted-foreground capitalize">{formattedType}</span>
            </div>
          </div>
          <Badge variant="secondary" className="capitalize">
            {formattedType}
          </Badge>
        </div>
        <FieldDescription>
          Enter the code we sent to this address to continue.
        </FieldDescription>
      </Field>
    </FieldGroup>
  )
}
