'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { OTPForm } from './otp-form'
import { verifyOTPAction, resendOTPAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'

export function OTPVerificationForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') || ''
  const type = searchParams.get('type') as 'password_reset' | 'email_confirmation' | 'two_factor' || 'password_reset'
  const planId = searchParams.get('plan')

  const handleVerify = async (otp: string) => {
    const result = await verifyOTPAction({
      email,
      otp,
      type,
    })

    if (!result.error) {
      // Handle different verification types
      if (type === 'password_reset') {
        // Redirect to update password page
        router.push(`${ROUTES.UPDATE_PASSWORD}?email=${encodeURIComponent(email)}&profileId=${result.profileId}`)
      } else if (type === 'email_confirmation') {
        // If user came from pricing page with a plan, redirect to pricing to complete checkout
        if (planId) {
          router.push(`${ROUTES.PRICING}?selected=${planId}`)
        } else {
          // Otherwise redirect to dashboard
          router.push(ROUTES.CLIENT_DASHBOARD)
        }
      }
      return { success: true }
    }

    return { success: false, message: result.error }
  }

  const handleResend = async () => {
    await resendOTPAction({
      email,
      type,
    })
  }

  const getTitle = () => {
    switch (type) {
      case 'password_reset':
        return 'Reset Password'
      case 'email_confirmation':
        return 'Confirm Email'
      case 'two_factor':
        return 'Two-Factor Authentication'
      default:
        return 'Verify Code'
    }
  }

  const getDescription = () => {
    switch (type) {
      case 'password_reset':
        return 'Enter the code we sent to your email to reset your password.'
      case 'email_confirmation':
        return 'Enter the code we sent to confirm your email address.'
      case 'two_factor':
        return 'Enter your two-factor authentication code.'
      default:
        return 'Enter the verification code sent to your email.'
    }
  }

  if (!email) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Missing verification email</EmptyTitle>
          <EmptyDescription>
            This verification link is incomplete. Request a new code to continue.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div
            className="flex justify-center gap-0 [&>*:not(:first-child)]:-ml-px"
            role="group"
          >
            <Button onClick={() => router.push(ROUTES.RESET_PASSWORD)}>
              Request new code
            </Button>
            <Button variant="outline" onClick={() => router.push(ROUTES.LOGIN)}>
              Back to login
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <OTPForm
      email={email}
      verificationType={type}
      onVerify={handleVerify}
      onResend={handleResend}
      title={getTitle()}
      description={getDescription()}
    />
  )
}
