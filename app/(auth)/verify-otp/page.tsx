import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { OTPVerificationForm } from '@/features/auth/components/otp-verification-form'

export default function VerifyOTPPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div className="flex justify-center p-8"><Spinner className="size-6" /></div>}>
          <OTPVerificationForm />
        </Suspense>
      </div>
    </div>
  )
}