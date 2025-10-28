'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Form, FormField, FormItem } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
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
  const [passwordStrength, setPasswordStrength] = useState(
    calculatePasswordStrength('')
  )
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
    <Item variant="outline" className="space-y-4 p-6">
      <ItemContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FieldSet className="space-y-4">
              <FieldLegend>Create your account</FieldLegend>
              <FieldDescription>
                Provide your contact details and choose a secure password to get started.
              </FieldDescription>
              <FieldGroup className="space-y-4">
                {planId ? (
                  <Item variant="outline" size="sm">
                    <ItemMedia>
                      <ClipboardList className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Selected Plan</ItemTitle>
                      <ItemDescription>
                        We&apos;ll prepare checkout for plan {planId}.
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                ) : null}

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
            </FieldSet>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner /> : 'Create account'}
            </Button>

            <FieldGroup className="items-center justify-center gap-2">
              <Field orientation="horizontal" className="w-full items-center justify-center gap-2">
                <FieldDescription>Already have an account?</FieldDescription>
                <ButtonGroup>
                  <Button asChild variant="link" size="sm">
                    <Link href={ROUTES.LOGIN}>Sign in</Link>
                  </Button>
                </ButtonGroup>
              </Field>
            </FieldGroup>
          </form>
        </Form>
      </ItemContent>
    </Item>
  )
}
