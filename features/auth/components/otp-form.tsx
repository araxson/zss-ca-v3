'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

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
  description = 'We\'ve sent a 6-digit verification code to your email.',
}: OTPFormProps) {
  const router = useRouter()
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

  // Resend timer
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
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

      // Redirect based on verification type
      if (verificationType === 'password_reset') {
        router.push(`${ROUTES.RESET_PASSWORD}?verified=true&email=${email}`)
      } else if (verificationType === 'email_confirmation') {
        router.push(ROUTES.CLIENT_DASHBOARD)
      } else {
        router.push(ROUTES.CLIENT_DASHBOARD)
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-center rounded-lg bg-muted p-4">
          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{email}</span>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      disabled={isLoading}
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
                  </FormControl>
                  <FormDescription>
                    Please enter the 6-digit code sent to your email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>

              {onResend && (
                <div className="text-center">
                  {canResend ? (
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResend}
                      disabled={isResending}
                      className="text-sm"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        'Resend Code'
                      )}
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Resend code in {resendTimer} seconds
                    </p>
                  )}
                </div>
              )}

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.back()}
                  className="text-sm"
                >
                  Go Back
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
