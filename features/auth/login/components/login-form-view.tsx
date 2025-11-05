'use client'

import { AuthFormLayout } from '@/features/auth/components/auth-form-layout'
import { AuthInfoPanel } from '@/features/auth/components/auth-info-panel'
import { LoginFormAlerts } from './login-form-alerts'
import { LoginFormFields } from './login-form-fields'

interface LoginFormState {
  error?: string | null
  fieldErrors?: Record<string, string[]>
}

interface LoginFormViewProps {
  state: LoginFormState | null
  isPending: boolean
  isRateLimited: boolean
  remainingRateLimitSeconds: number | null
  rateLimitProgress: number
  rememberMe: boolean
  onRememberChange: (checked: boolean) => void
  showPassword: boolean
  onTogglePassword: (next: boolean) => void
  formAction: (formData: FormData) => void
  infoMessage: string | null
  emailError: string | null
  onEmailErrorChange: (message: string | null) => void
}

export function LoginFormView({
  state,
  isPending,
  isRateLimited,
  remainingRateLimitSeconds,
  rateLimitProgress,
  rememberMe,
  onRememberChange,
  showPassword,
  onTogglePassword,
  formAction,
  infoMessage,
  emailError,
  onEmailErrorChange,
}: LoginFormViewProps): React.JSX.Element {
  const alerts = (
    <LoginFormAlerts
      infoMessage={infoMessage}
      state={state}
      isRateLimited={isRateLimited}
      remainingRateLimitSeconds={remainingRateLimitSeconds}
      rateLimitProgress={rateLimitProgress}
    />
  )

  return (
    <AuthFormLayout
      legend="Sign in details"
      title="Welcome back"
      description="Sign in to manage your Zenith Sites subscription and support requests."
      beforeForm={alerts ?? undefined}
      infoPanel={
        <AuthInfoPanel
          badge="Admin access"
          title="Why sign in?"
          description="Streamline site management with faster routes to the tools you use every day."
          items={[
            'Jump to any area with the command palette (⌘ + K)',
            'Track deployments and launch progress in real time',
            'Resolve tickets faster with linked client context',
          ]}
        />
      }
    >
      <LoginFormFields
        formAction={formAction}
        state={state}
        isPending={isPending}
        isRateLimited={isRateLimited}
        rememberMe={rememberMe}
        onRememberChange={onRememberChange}
        showPassword={showPassword}
        onTogglePassword={onTogglePassword}
        emailError={emailError}
        onEmailErrorChange={onEmailErrorChange}
      />
    </AuthFormLayout>
  )
}
