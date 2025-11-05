'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { resetPasswordAction } from '../api/mutations'
import { AuthFormAnnouncements } from '@/features/auth/components/auth-form-announcements'
import { useFocusFirstError } from '@/features/auth/hooks/use-focus-first-error'
import { useFaviconPending } from '@/features/auth/hooks/use-favicon-pending'
import { ResetPasswordFormView } from './reset-password-form-view'
import { ROUTES } from '@/lib/constants/routes'

type ResetPasswordState = {
  error?: string | null
  fieldErrors?: Record<string, string[]>
} | null

export function ResetPasswordForm(): React.JSX.Element {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, null)
  const [emailError, setEmailError] = useState<string | null>(null)

  useFocusFirstError(state?.fieldErrors ?? null)
  useFaviconPending(isPending)

  const announcements = [
    isPending && 'Sending verification code, please wait',
    !isPending && state?.error,
  ]

  useEffect(() => {
    if (!emailError) {
      return
    }
    const timer = window.setTimeout(() => setEmailError(null), 4000)
    return () => window.clearTimeout(timer)
  }, [emailError])

  return (
    <div className="flex flex-col items-center gap-6">
      <AuthFormAnnouncements messages={announcements} />

      <ResetPasswordFormView
        state={state as ResetPasswordState}
        isPending={isPending}
        formAction={formAction}
        emailError={emailError}
        onEmailErrorChange={setEmailError}
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
