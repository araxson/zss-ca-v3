'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { updatePasswordAction } from '../api/mutations'
import { calculatePasswordStrength } from '@/lib/utils/password-strength'
import type { PasswordStrengthResult } from '@/lib/utils/password-strength'
import { AuthFormAnnouncements } from '@/features/auth/components/auth-form-announcements'
import { useFocusFirstError } from '@/features/auth/hooks/use-focus-first-error'
import { useFaviconPending } from '@/features/auth/hooks/use-favicon-pending'
import { UpdatePasswordFormView } from './update-password-form-view'
import { ROUTES } from '@/lib/constants/routes'

type UpdatePasswordState = {
  error?: string | null
  fieldErrors?: Record<string, string[]>
} | null

export function UpdatePasswordForm(): React.JSX.Element {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [passwordAnnouncement, setPasswordAnnouncement] = useState<string | null>(null)

  const [state, formAction, isPending] = useActionState(updatePasswordAction, null)

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

  if (!email) {
    return (
      <Alert variant="destructive" aria-live="assertive">
        <AlertDescription>
          Invalid password reset link. Please request a new verification code.
        </AlertDescription>
        <Link href={ROUTES.RESET_PASSWORD} className="mt-2 inline-flex text-sm text-primary hover:underline">
          Request new code
        </Link>
      </Alert>
    )
  }

  const announcements = [
    isPending && 'Updating your password, please wait',
    !isPending && state?.error,
    passwordAnnouncement,
  ]

  return (
    <div className="flex flex-col items-center gap-6">
      <AuthFormAnnouncements messages={announcements} />

      <UpdatePasswordFormView
        state={state as UpdatePasswordState}
        isPending={isPending}
        formAction={formAction}
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
        email={email}
      />

      <p className="text-center text-sm text-muted-foreground">
        By continuing you agree to our{' '}
        <Link href={ROUTES.PRIVACY}>Privacy Policy</Link>{' '}
        and{' '}
        <Link href={ROUTES.TERMS}>Terms of Service</Link>.
      </p>
    </div>
  )
}
