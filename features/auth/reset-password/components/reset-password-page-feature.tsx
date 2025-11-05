'use client'

import { Suspense } from 'react'
import { ResetPasswordForm } from './reset-password-form'
import { AuthFormSkeleton } from '@/features/auth/components/auth-form-skeleton'

export function ResetPasswordPageFeature(): React.JSX.Element {
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <Suspense
          fallback={<AuthFormSkeleton ariaLabel="Loading password reset form" formRows={1} />}
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
