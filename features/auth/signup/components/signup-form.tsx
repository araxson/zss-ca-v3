'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signupAction } from '../api/mutations'
import { calculatePasswordStrength } from '@/lib/utils/password-strength'
import type { PasswordStrengthResult } from '@/lib/utils/password-strength'
import { AuthFormAnnouncements } from '@/features/auth/components/auth-form-announcements'
import { useFocusFirstError } from '@/features/auth/hooks/use-focus-first-error'
import { useFaviconPending } from '@/features/auth/hooks/use-favicon-pending'
import { SignupFormView } from './signup-form-view'
import { ROUTES } from '@/lib/constants/routes'

type SignupState = {
  error?: string | null
  fieldErrors?: Record<string, string[]>
} | null

export function SignupForm(): React.JSX.Element {
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [passwordAnnouncement, setPasswordAnnouncement] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [state, formAction, isPending] = useActionState(signupAction, null)

  useFocusFirstError(state?.fieldErrors ?? null)
  useFaviconPending(isPending)

  const passwordResult: PasswordStrengthResult = useMemo(
    () => calculatePasswordStrength(passwordValue),
    [passwordValue],
  )

  useEffect(() => {
    if (!passwordAnnouncement) {
      return
    }

    const timer = window.setTimeout(() => setPasswordAnnouncement(null), 1500)
    return () => window.clearTimeout(timer)
  }, [passwordAnnouncement])

  const announcements = [
    isPending && 'Creating your account, please wait',
    !isPending && state?.error,
    passwordAnnouncement,
  ]

  return (
    <div className="flex flex-col items-center gap-6">
      <AuthFormAnnouncements messages={announcements} />

      <SignupFormView
        state={state as SignupState}
        isPending={isPending}
        formAction={formAction}
        emailError={emailError}
        onEmailErrorChange={setEmailError}
        passwordResult={passwordResult}
        onPasswordInput={setPasswordValue}
        showPassword={showPassword}
        onTogglePassword={(next) => {
          setShowPassword(next)
          setPasswordAnnouncement(next ? 'Password field is now visible' : 'Password field is hidden')
        }}
        showConfirmPassword={showConfirmPassword}
        onToggleConfirmPassword={(next) => {
          setShowConfirmPassword(next)
          setPasswordAnnouncement(next ? 'Confirm password field is now visible' : 'Confirm password field is hidden')
        }}
        planId={planId}
      />

      <p className="text-center text-sm text-muted-foreground">
        By creating an account you agree to our{' '}
        <Link href={ROUTES.PRIVACY}>Privacy Policy</Link>{' '}
        and{' '}
        <Link href={ROUTES.TERMS}>Terms of Service</Link>.
      </p>
    </div>
  )
}
