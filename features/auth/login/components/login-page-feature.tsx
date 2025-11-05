'use client'

import { Suspense } from 'react'
import { LoginForm } from './login-form'
import { AuthFormSkeleton } from '@/features/auth/components/auth-form-skeleton'

export function LoginPageFeature(): React.JSX.Element {
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <Suspense
          fallback={<AuthFormSkeleton ariaLabel="Loading sign in form" formRows={2} />}
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
