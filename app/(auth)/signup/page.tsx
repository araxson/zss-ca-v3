import type { Metadata } from 'next'
import { SignupPageFeature } from '@/features/auth'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
}

export default function SignupPage() {
  return <SignupPageFeature />
}
