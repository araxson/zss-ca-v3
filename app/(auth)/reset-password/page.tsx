import type { Metadata } from 'next'
import { ResetPasswordPageFeature } from '@/features/auth'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your password',
}

export default function ResetPasswordPage() {
  return <ResetPasswordPageFeature />
}
