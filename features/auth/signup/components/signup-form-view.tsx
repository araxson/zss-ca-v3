'use client'

import { AuthFormLayout } from '@/features/auth/components/auth-form-layout'
import { AuthInfoPanel } from '@/features/auth/components/auth-info-panel'
import { SignupFormStepper } from './signup-form-stepper'
import { SignupFormAlerts } from './signup-form-alerts'
import { SignupFormFields } from './signup-form-fields'
import type { PasswordStrengthResult } from '@/lib/utils/password-strength'

interface SignupFormState {
  error?: string | null
  fieldErrors?: Record<string, string[]>
}

interface SignupFormViewProps {
  state: SignupFormState | null
  isPending: boolean
  formAction: (formData: FormData) => void
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

export function SignupFormView({
  state,
  isPending,
  formAction,
  emailError,
  onEmailErrorChange,
  passwordResult,
  onPasswordInput,
  showPassword,
  onTogglePassword,
  showConfirmPassword,
  onToggleConfirmPassword,
  planId,
}: SignupFormViewProps): React.JSX.Element {
  const alerts = <SignupFormAlerts error={state?.error ?? null} />
  const beforeForm = alerts || planId
    ? (
      <div className="space-y-4">
        {alerts}
        {planId ? (
          <div className="rounded-md border border-dashed bg-muted/40 p-3 text-sm text-muted-foreground">
            We&apos;ll prepare checkout for plan{' '}
            <span className="font-medium text-foreground">{planId}</span> after verification.
          </div>
        ) : null}
      </div>
    )
    : undefined

  return (
    <AuthFormLayout
      legend="Create account details"
      title="Create your account"
      description="Provide your contact details and choose a secure password to get started."
      headingAdornment={<SignupFormStepper />}
      beforeForm={beforeForm}
      infoPanel={
        <AuthInfoPanel
          badge="Launch ready"
          title="Tailored onboarding"
          description="Invite your team, track implementation milestones, and move from signup to launch without friction."
          items={[
            'Guided email verification and OTP security',
            'Plan-aware onboarding when selecting pricing tiers',
            'Detailed password requirements with instant feedback',
          ]}
        />
      }
    >
      <SignupFormFields
        formAction={formAction}
        state={state}
        isPending={isPending}
        emailError={emailError}
        onEmailErrorChange={onEmailErrorChange}
        passwordResult={passwordResult}
        onPasswordInput={onPasswordInput}
        showPassword={showPassword}
        onTogglePassword={onTogglePassword}
        showConfirmPassword={showConfirmPassword}
        onToggleConfirmPassword={onToggleConfirmPassword}
        planId={planId}
      />
    </AuthFormLayout>
  )
}
