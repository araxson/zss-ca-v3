'use client'

import { AuthFormLayout } from '@/features/auth/components/auth-form-layout'
import { AuthInfoPanel } from '@/features/auth/components/auth-info-panel'
import { ResetPasswordFormStepper } from './reset-password-form-stepper'
import { ResetPasswordFormAlerts } from './reset-password-form-alerts'
import { ResetPasswordFormFields } from './reset-password-form-fields'

interface ResetPasswordState {
  error?: string | null
  fieldErrors?: Record<string, string[]>
}

interface ResetPasswordFormViewProps {
  state: ResetPasswordState | null
  isPending: boolean
  formAction: (formData: FormData) => void
  emailError: string | null
  onEmailErrorChange: (message: string | null) => void
}

export function ResetPasswordFormView({
  state,
  isPending,
  formAction,
  emailError,
  onEmailErrorChange,
}: ResetPasswordFormViewProps): React.JSX.Element {
  const alerts = <ResetPasswordFormAlerts error={state?.error ?? null} />

  return (
    <AuthFormLayout
      legend="Reset password details"
      title="Reset your password"
      description="Enter your email address and we’ll send you a verification code."
      headingAdornment={<ResetPasswordFormStepper />}
      beforeForm={alerts ?? undefined}
      infoPanel={
        <AuthInfoPanel
          badge="Secure recovery"
          title="Account Recovery"
          description="Secure your account by resetting your password. A verification code will be sent to your email address."
          items={[
            'Verification codes expire after 10 minutes',
            'Resend links are available from the OTP screen',
            'You can contact support if you no longer have access',
          ]}
        />
      }
    >
      <ResetPasswordFormFields
        formAction={formAction}
        state={state}
        isPending={isPending}
        emailError={emailError}
        onEmailErrorChange={onEmailErrorChange}
      />
    </AuthFormLayout>
  )
}
