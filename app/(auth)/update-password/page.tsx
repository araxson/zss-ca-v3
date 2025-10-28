import type { Metadata } from 'next'
import { UpdatePasswordPageFeature } from '@/features/auth'

export const metadata: Metadata = {
  title: 'Update Password',
  description: 'Set your new password',
}

export default function UpdatePasswordPage() {
  return <UpdatePasswordPageFeature />
}
