'use client'

import { FieldGroup, FieldSeparator } from '@/components/ui/field'
import { AuthSubmitButton } from '@/features/auth/components/auth-submit-button'
import { UpdatePasswordNewPasswordField } from './update-password-new-password-field'
import { UpdatePasswordConfirmPasswordField } from './update-password-confirm-password-field'
import type { PasswordStrengthResult } from '@/lib/utils/password-strength'

interface UpdatePasswordFormFieldsProps {
  formAction: (formData: FormData) => void
  state: { fieldErrors?: Record<string, string[]> } | null
  isPending: boolean
  passwordResult: PasswordStrengthResult
  onPasswordInput: (value: string) => void
  showPassword: boolean
  onTogglePassword: (pressed: boolean) => void
  showConfirmPassword: boolean
  onToggleConfirmPassword: (pressed: boolean) => void
  email: string
}

export function UpdatePasswordFormFields({
  formAction,
  state,
  isPending,
  passwordResult,
  onPasswordInput,
  showPassword,
  onTogglePassword,
  showConfirmPassword,
  onToggleConfirmPassword,
  email,
}: UpdatePasswordFormFieldsProps): React.JSX.Element {
  return (
    <form action={formAction} className="space-y-6" noValidate>
      <input type="hidden" name="email" value={email} />

      <FieldGroup className="gap-4">
        <UpdatePasswordNewPasswordField
          fieldErrors={state?.fieldErrors}
          isPending={isPending}
          passwordResult={passwordResult}
          showPassword={showPassword}
          onTogglePassword={onTogglePassword}
          onPasswordInput={onPasswordInput}
        />

        <UpdatePasswordConfirmPasswordField
          fieldErrors={state?.fieldErrors}
          isPending={isPending}
          showConfirmPassword={showConfirmPassword}
          onToggleConfirmPassword={onToggleConfirmPassword}
        />
      </FieldGroup>

      <FieldSeparator />

      <AuthSubmitButton
        label="Update password"
        loadingLabel="Updating your password"
      />
    </form>
  )
}
