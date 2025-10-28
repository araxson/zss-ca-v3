import type { Metadata } from 'next'
import { LoginPageFeature } from '@/features/auth'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return <LoginPageFeature />
}
