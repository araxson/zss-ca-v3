'use client'

import { Suspense } from 'react'
import { UpdatePasswordForm } from './update-password-form'
import { AuthFormSkeleton } from '@/features/auth/components/auth-form-skeleton'

export function UpdatePasswordPageFeature(): React.JSX.Element {
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <Suspense
          fallback={<AuthFormSkeleton ariaLabel="Loading update password form" formRows={2} />}
        >
          <UpdatePasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
