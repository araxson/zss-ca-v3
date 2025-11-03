'use client'

import * as React from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Item } from '@/components/ui/item'
import { FieldGroup } from '@/components/ui/field'
import { ROUTES } from '@/lib/constants/routes'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import { OTPFormHeader } from './otp-form-header'
import { OTPFormActions } from './otp-form-actions'

const otpSchema = z.object({
  otp: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
})

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
  const [isLoading, setIsLoading] = React.useState(false)
  const [isResending, setIsResending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [canResend, setCanResend] = React.useState(false)
  const [resendTimer, setResendTimer] = React.useState(60)

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  })

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }

    setCanResend(true)
  }, [resendTimer])

  async function onSubmit(data: z.infer<typeof otpSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await onVerify(data.otp)

      if (!result.success) {
        setError(result.message || 'Invalid verification code')
        form.reset()
        return
      }
    } catch (_err) {
      setError('An error occurred. Please try again.')
      form.reset()
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResend() {
    if (!canResend || !onResend) return

    setIsResending(true)
    setError(null)

    try {
      await onResend()
      setCanResend(false)
      setResendTimer(60)
      form.reset()
    } catch (_err) {
      setError('Failed to resend code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <Item variant="outline" className="overflow-hidden bg-card max-w-7xl w-full">
        <div className="grid p-0 md:grid-cols-2 gap-0 w-full">
          <FieldGroup className="gap-6 p-6 md:p-8">
            <OTPFormHeader
              title={title}
              description={description}
              email={email}
              verificationType={verificationType}
            />

            {error ? (
              <Alert variant="destructive" aria-live="assertive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldGroup className="gap-4">
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormFieldLayout
                          label="One-Time Password"
                          description="Enter the 6-digit code sent to your email"
                        >
                          <FormControl>
                            <InputOTP maxLength={6} disabled={isLoading} {...field}>
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
                          </FormControl>
                        </FormFieldLayout>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FieldGroup>

                <OTPFormActions
                  isLoading={isLoading}
                  isResending={isResending}
                  canResend={canResend}
                  resendTimer={resendTimer}
                  onResend={onResend ? handleResend : undefined}
                />
              </form>
            </Form>
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
