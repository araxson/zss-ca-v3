import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth'
import { ItemGroup } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ItemGroup className="w-full max-w-md space-y-6">
        <SectionHeader
          title="Sign in"
          description="Enter your email and password to access your account"
          align="start"
        />
        <LoginForm />
      </ItemGroup>
    </div>
  )
}
