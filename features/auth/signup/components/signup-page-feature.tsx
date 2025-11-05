'use client'

import { Suspense } from 'react'
import { SignupForm } from './signup-form'
import { AuthFormSkeleton } from '@/features/auth/components/auth-form-skeleton'

export function SignupPageFeature(): React.JSX.Element {
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <Suspense
          fallback={<AuthFormSkeleton ariaLabel="Loading sign up form" formRows={4} />}
        >
          <SignupForm />
        </Suspense>
      </div>
    </div>
  )
}
