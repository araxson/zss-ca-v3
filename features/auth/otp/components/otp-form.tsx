'use client'

import { Fragment, useActionState, useState, useEffect } from 'react'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Item } from '@/components/ui/item'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { ROUTES } from '@/lib/constants/routes'
import { OTPFormHeader } from './otp-form-header'
import { OTPFormActions } from './otp-form-actions'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils/index'
import { Kbd } from '@/components/ui/kbd'
import { AuthFormAnnouncements } from '@/features/auth/components/auth-form-announcements'

interface OTPFormProps {
  email: string
  verificationType: 'password_reset' | 'email_confirmation' | 'two_factor'
  onVerify: (otp: string) => Promise<{ success: boolean; message?: string }>
  onResend?: () => Promise<void>
  title?: string
  description?: string
}

export function OTPForm({
  email,
  verificationType,
  onVerify,
  onResend,
  title = 'Enter Verification Code',
  description = "We've sent a 6-digit verification code to your email.",
}: OTPFormProps) {
  const [isResending, setIsResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [otpAnnouncement, setOtpAnnouncement] = useState<string | null>(null)
  const otpDescriptionId = 'otp-instructions'
  const verificationSteps = (() => {
    if (verificationType === 'password_reset') {
      return [
        { label: '1. Request Reset', status: 'complete' as const },
        { label: '2. Verify Code', status: 'current' as const },
        { label: '3. Update Password', status: 'upcoming' as const },
      ]
    }

    if (verificationType === 'email_confirmation') {
      return [
        { label: '1. Create Account', status: 'complete' as const },
        { label: '2. Verify Email', status: 'current' as const },
        { label: '3. Get Started', status: 'upcoming' as const },
      ]
    }

    return [
      { label: '1. Sign In', status: 'complete' as const },
      { label: '2. Verify Code', status: 'current' as const },
      { label: '3. Access Account', status: 'upcoming' as const },
    ]
  })()

  // Handle resend cooldown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [resendTimer])

  useEffect(() => {
    if (!resendSuccess) {
      return
    }

    toast.success('Verification code sent', {
      description: 'Check your email for the new code. It may take a few moments to arrive.',
    })

    const timer = setTimeout(() => setResendSuccess(false), 5000)
    return () => clearTimeout(timer)
  }, [resendSuccess])

  useEffect(() => {
    if (isPending) {
      setOtpAnnouncement('Verifying code, please wait')
    }
  }, [isPending])

  useEffect(() => {
    if (!otpAnnouncement) {
      return
    }

    const timer = setTimeout(() => setOtpAnnouncement(null), 1500)
    return () => clearTimeout(timer)
  }, [otpAnnouncement])

  // Create a wrapper action for useActionState
  const verifyAction = async (
    prevState: { error?: string; success?: boolean } | null,
    formData: FormData
  ) => {
    const otp = formData.get('otp') as string

    if (!otp || otp.length !== 6) {
      return {
        error: 'Please enter a valid 6-digit code',
      }
    }

    try {
      const result = await onVerify(otp)

      if (!result.success) {
        return {
          error: result.message || 'Invalid or expired verification code. Please try again or request a new code.',
        }
      }

      toast.success('Code verified successfully', {
        description: 'Redirecting you to the next step.',
      })

      return {
        success: true,
      }
    } catch (_error) {
      return {
        error: 'An error occurred while verifying your code. Please try again.',
      }
    }
  }

  const handleResend = async () => {
    if (!onResend || isResending || resendTimer > 0) return

    setIsResending(true)
    setResendSuccess(false)

    try {
      await onResend()
      setResendTimer(60) // 60 second cooldown
      setResendSuccess(true)
      setOtpAnnouncement('Verification code resent successfully')
    } catch (error) {
      console.error('Failed to resend code:', error)
    } finally {
      setIsResending(false)
    }
  }

  const [state, formAction, isPending] = useActionState(verifyAction, null)

  const announcements = [
    isPending && 'Verifying code, please wait',
    isResending && 'Sending new code, please wait',
    !isPending && state?.error,
    !isPending && state?.success && 'Code verified successfully',
    resendSuccess && 'New code sent successfully',
    resendTimer > 0 && `You can request a new code in ${resendTimer} seconds`,
    otpAnnouncement,
  ]

  return (
    <div className="flex flex-col gap-6 items-center">
      <AuthFormAnnouncements messages={announcements} />

      <Item variant="outline" className="overflow-hidden bg-card max-w-7xl w-full">
        <div className="grid p-0 md:grid-cols-2 gap-0 w-full">
          <FieldGroup className="gap-6 p-6 md:p-8">
            <Breadcrumb>
              <BreadcrumbList>
                {verificationSteps.map((step, index) => (
                  <Fragment key={step.label}>
                    <BreadcrumbItem>
                      {step.status === 'current' ? (
                        <BreadcrumbPage className="font-medium text-foreground">
                          {step.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <span
                            className={cn(
                              step.status === 'complete' ? 'text-foreground' : 'text-muted-foreground',
                            )}
                          >
                            {step.label}
                          </span>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < verificationSteps.length - 1 ? <BreadcrumbSeparator /> : null}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <OTPFormHeader
              title={title}
              description={description}
              email={email}
              verificationType={verificationType}
            />

            {/* Success message for code resend */}
            {resendSuccess ? (
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Code sent</AlertTitle>
                <AlertDescription>
                  A new verification code has been sent to your email. It may take a few minutes to arrive.
                </AlertDescription>
              </Alert>
            ) : null}

            {/* Error message from form submission */}
            {state?.error ? (
              <Alert variant="destructive" aria-live="assertive">
                <AlertCircle className="size-4" />
                <AlertTitle>Verification failed</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            ) : null}

            <form action={formAction} className="space-y-6" noValidate>
              <FieldGroup className="gap-4">
                <Field data-invalid={!!state?.error}>
                  <FieldLabel htmlFor="otp">One-Time Password</FieldLabel>
                  <FieldDescription id={otpDescriptionId}>
                    Enter the 6-digit code we sent. Use <Kbd>Tab</Kbd> to move forward and{' '}
                    <Kbd>Shift</Kbd>+<Kbd>Tab</Kbd> to move back between slots.
                  </FieldDescription>
                  <InputOTP
                    maxLength={6}
                    disabled={isPending}
                    name="otp"
                    id="otp"
                    required
                    aria-required="true"
                    aria-invalid={!!state?.error}
                    aria-describedby={[
                      state?.error ? 'otp-error' : null,
                      otpDescriptionId,
                    ].filter(Boolean).join(' ')}
                    onChange={(value) => {
                      if (value.length === 3) {
                        setOtpAnnouncement('Halfway through code entry')
                      }
                    }}
                    onComplete={() => {
                      setOtpAnnouncement('Code entry complete, verifying now')
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {state?.error ? (
                    <FieldError id="otp-error" errors={[{ message: state.error }]} />
                  ) : null}
                </Field>
              </FieldGroup>

              <OTPFormActions
                isResending={isResending}
                canResend={resendTimer === 0}
                resendTimer={resendTimer}
                onResend={handleResend}
              />
            </form>
          </FieldGroup>

          <div className="bg-muted relative hidden md:flex items-center rounded-md justify-center text-center">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Secure verification</h2>
              <p className="text-muted-foreground text-sm text-balance">
                Protect access to your sites and tickets with a quick one-time code delivered to your inbox.
              </p>
            </div>
          </div>
        </div>
      </Item>

      <p className="text-center text-sm text-muted-foreground">
        By continuing you agree to our{' '}
        <Link href={ROUTES.PRIVACY}>Privacy Policy</Link>{' '}and{' '}
        <Link href={ROUTES.TERMS}>Terms of Service</Link>.
      </p>
    </div>
  )
}
