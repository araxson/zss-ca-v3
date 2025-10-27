import { Suspense } from 'react'
import { OTPVerificationForm } from '@/features/auth/components/otp-verification-form'

export default function VerifyOTPPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Loading...</div>}>
          <OTPVerificationForm />
        </Suspense>
      </div>
    </div>
  )
}