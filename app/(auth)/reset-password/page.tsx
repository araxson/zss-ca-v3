import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/features/auth'
import { ItemGroup } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your password',
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ItemGroup className="w-full max-w-md space-y-6">
        <SectionHeader
          title="Reset password"
          description="Enter your email to receive a verification code"
          align="start"
        />
        <ResetPasswordForm />
      </ItemGroup>
    </div>
  )
}
