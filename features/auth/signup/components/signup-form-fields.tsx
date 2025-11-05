'use client'

import { FieldGroup, FieldSeparator } from '@/components/ui/field'
import { AuthSubmitButton } from '@/features/auth/components/auth-submit-button'
import { SignupEmailField } from './signup-email-field'
import { SignupCompanyField } from './signup-company-field'
import { SignupPasswordField } from './signup-password-field'
import { SignupConfirmPasswordField } from './signup-confirm-password-field'
import type { PasswordStrengthResult } from '@/lib/utils/password-strength'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

interface SignupFormFieldsProps {
  formAction: (formData: FormData) => void
  state: { fieldErrors?: Record<string, string[]> } | null
  isPending: boolean
  emailError: string | null
  onEmailErrorChange: (message: string | null) => void
  passwordResult: PasswordStrengthResult
  onPasswordInput: (value: string) => void
  showPassword: boolean
  onTogglePassword: (pressed: boolean) => void
  showConfirmPassword: boolean
  onToggleConfirmPassword: (pressed: boolean) => void
  planId: string | null
}

export function SignupFormFields({
  formAction,
  state,
  isPending,
  emailError,
  onEmailErrorChange,
  passwordResult,
  onPasswordInput,
  showPassword,
  onTogglePassword,
  showConfirmPassword,
  onToggleConfirmPassword,
  planId,
}: SignupFormFieldsProps): React.JSX.Element {
  return (
    <form action={formAction} className="space-y-6" noValidate>
      {planId ? <input type="hidden" name="planId" value={planId} /> : null}

      <FieldGroup className="gap-4">
        <SignupEmailField
          fieldErrors={state?.fieldErrors}
          isPending={isPending}
          emailError={emailError}
          onEmailErrorChange={onEmailErrorChange}
        />

        <SignupCompanyField
          fieldErrors={state?.fieldErrors}
          isPending={isPending}
        />

        <SignupPasswordField
          fieldErrors={state?.fieldErrors}
          isPending={isPending}
          passwordResult={passwordResult}
          showPassword={showPassword}
          onTogglePassword={onTogglePassword}
          onPasswordInput={onPasswordInput}
        />

        <SignupConfirmPasswordField
          fieldErrors={state?.fieldErrors}
          isPending={isPending}
          showConfirmPassword={showConfirmPassword}
          onToggleConfirmPassword={onToggleConfirmPassword}
        />
      </FieldGroup>

      <FieldSeparator />

      <AuthSubmitButton label="Create account" loadingLabel="Creating your account" />

      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-muted-foreground">Already have an account?</span>
        <Button asChild variant="link" size="sm">
          <Link href={ROUTES.LOGIN}>Sign in</Link>
        </Button>
      </div>
    </form>
  )
}
