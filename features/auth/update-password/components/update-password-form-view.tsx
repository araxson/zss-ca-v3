'use client'

import { AuthFormLayout } from '@/features/auth/components/auth-form-layout'
import { AuthInfoPanel } from '@/features/auth/components/auth-info-panel'
import { UpdatePasswordFormStepper } from './update-password-form-stepper'
import { UpdatePasswordFormAlerts } from './update-password-form-alerts'
import { UpdatePasswordFormFields } from './update-password-form-fields'
import type { PasswordStrengthResult } from '@/lib/utils/password-strength'

interface UpdatePasswordState {
  error?: string | null
  fieldErrors?: Record<string, string[]>
}

interface UpdatePasswordFormViewProps {
  state: UpdatePasswordState | null
  isPending: boolean
  formAction: (formData: FormData) => void
  passwordResult: PasswordStrengthResult
  onPasswordInput: (value: string) => void
  showPassword: boolean
  onTogglePassword: (pressed: boolean) => void
  showConfirmPassword: boolean
  onToggleConfirmPassword: (pressed: boolean) => void
  email: string
}

export function UpdatePasswordFormView({
  state,
  isPending,
  formAction,
  passwordResult,
  onPasswordInput,
  showPassword,
  onTogglePassword,
  showConfirmPassword,
  onToggleConfirmPassword,
  email,
}: UpdatePasswordFormViewProps): React.JSX.Element {
  const alerts = <UpdatePasswordFormAlerts error={state?.error ?? null} />

  return (
    <AuthFormLayout
      legend="Update password details"
      title="Update your password"
      description="Create a new password for your account to keep it secure."
      headingAdornment={<UpdatePasswordFormStepper />}
      beforeForm={alerts ?? undefined}
      infoPanel={
        <AuthInfoPanel
          badge="Security matters"
          title="Security Matters"
          description="Use a strong password with uppercase, lowercase, numbers, and symbols to protect your account."
          items={[
            'Password updates re-authenticate your session automatically',
            'All devices will be signed out after completion',
            'Contact support if you need help regaining access',
          ]}
        />
      }
    >
      <UpdatePasswordFormFields
        formAction={formAction}
        state={state}
        isPending={isPending}
        passwordResult={passwordResult}
        onPasswordInput={onPasswordInput}
        showPassword={showPassword}
        onTogglePassword={onTogglePassword}
        showConfirmPassword={showConfirmPassword}
        onToggleConfirmPassword={onToggleConfirmPassword}
        email={email}
      />
    </AuthFormLayout>
  )
}
