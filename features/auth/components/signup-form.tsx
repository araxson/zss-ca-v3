'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Form } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
import { signupSchema, type SignupInput } from '../schema'
import { signupAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'
import { calculatePasswordStrength } from '@/lib/utils/password-strength'
import { SignupEmailField } from './signup-form-email-field'
import { SignupCompanyField } from './signup-form-company-field'
import { SignupPasswordField } from './signup-form-password-field'
import { SignupConfirmPasswordField } from './signup-form-confirm-password-field'

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(calculatePasswordStrength(''))
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
    },
  })

  const password = form.watch('password')

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password))
  }, [password])

  async function onSubmit(data: SignupInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await signupAction(data)

      if (result.error) {
        setError(result.error)
        toast.error('Signup failed', {
          description: result.error,
        })
      } else if (result.success) {
        toast.success('Account created!', {
          description: result.message,
        })
        const otpUrl = `${ROUTES.VERIFY_OTP}?email=${encodeURIComponent(data.email)}&type=email_confirmation${planId ? `&plan=${planId}` : ''}`
        router.push(otpUrl)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast.error('Signup failed', {
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <FieldGroup className="gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-semibold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Provide your contact details and choose a secure password to get started.
                </p>
              </div>

              {planId ? (
                <Field>
                  <FieldDescription>
                    We&apos;ll prepare checkout for plan {planId} after verification.
                  </FieldDescription>
                </Field>
              ) : null}

              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FieldGroup className="gap-4">
                    <SignupEmailField control={form.control} loading={loading} setValue={form.setValue} />
                    <SignupCompanyField control={form.control} loading={loading} setValue={form.setValue} />
                    <SignupPasswordField
                      control={form.control}
                      loading={loading}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      passwordStrength={passwordStrength}
                    />
                    <SignupConfirmPasswordField
                      control={form.control}
                      loading={loading}
                      showConfirmPassword={showConfirmPassword}
                      setShowConfirmPassword={setShowConfirmPassword}
                    />
                  </FieldGroup>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Spinner /> : 'Create account'}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-muted-foreground">Already have an account?</span>
                    <ButtonGroup className="gap-0 [&>*:not(:first-child)]:-ml-px">
                      <Button asChild variant="link" size="sm">
                        <Link href={ROUTES.LOGIN}>Sign in</Link>
                      </Button>
                    </ButtonGroup>
                  </div>
                </form>
              </Form>
            </FieldGroup>
          </div>

          <div className="bg-muted relative hidden min-h-[320px] md:flex items-center justify-center p-8 text-center">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Tailored onboarding</h2>
              <p className="text-muted-foreground text-sm text-balance">
                Invite your team, track implementation milestones, and move from signup to launch without friction.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        By creating an account you agree to our{' '}
        <Link href={ROUTES.PRIVACY}>Privacy Policy</Link>{' '}
        and{' '}
        <Link href={ROUTES.TERMS}>Terms of Service</Link>.
      </p>
    </div>
  )
}
