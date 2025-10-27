import type { Metadata } from 'next'
import { Suspense } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { SignupForm } from '@/features/auth/components/signup-form'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="flex justify-center p-8"><Spinner className="size-6" /></div>}>
            <SignupForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
