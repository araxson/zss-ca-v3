import { Suspense } from 'react'
import { OTPVerificationForm } from '@/features/auth'

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={null}>
      <OTPVerificationForm />
    </Suspense>
  )
}
