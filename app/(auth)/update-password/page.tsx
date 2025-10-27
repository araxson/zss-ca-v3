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
import { UpdatePasswordForm } from '@/features/auth/components/update-password-form'

export const metadata: Metadata = {
  title: 'Update Password',
  description: 'Set your new password',
}

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle>Set new password</CardTitle>
          <CardDescription>
            Enter your new password to complete the reset process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="flex justify-center p-8"><Spinner className="size-6" /></div>}>
            <UpdatePasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
