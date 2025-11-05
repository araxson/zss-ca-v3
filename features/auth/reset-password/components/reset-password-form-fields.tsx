'use client'

import { FieldGroup, FieldSeparator } from '@/components/ui/field'
import { AuthSubmitButton } from '@/features/auth/components/auth-submit-button'
import { ResetPasswordEmailField } from './reset-password-email-field'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

interface ResetPasswordFormFieldsProps {
  formAction: (formData: FormData) => void
  state: { fieldErrors?: Record<string, string[]> } | null
  isPending: boolean
  emailError: string | null
  onEmailErrorChange: (message: string | null) => void
}

export function ResetPasswordFormFields({
  formAction,
  state,
  isPending,
  emailError,
  onEmailErrorChange,
}: ResetPasswordFormFieldsProps): React.JSX.Element {
  return (
    <form action={formAction} className="space-y-6" noValidate>
      <FieldGroup className="gap-4">
        <ResetPasswordEmailField
          fieldErrors={state?.fieldErrors}
          isPending={isPending}
          emailError={emailError}
          onEmailErrorChange={onEmailErrorChange}
        />
      </FieldGroup>

      <FieldSeparator />

      <AuthSubmitButton
        label="Send verification code"
        loadingLabel="Sending verification code"
      />

      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-muted-foreground">Remember your password?</span>
        <Button asChild variant="link" size="sm">
          <Link href={ROUTES.LOGIN}>Sign in</Link>
        </Button>
      </div>
    </form>
  )
}
