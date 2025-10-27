'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Mail, Building2, Lock, Eye, EyeOff, X, Loader2, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  InputGroupText,
} from '@/components/ui/input-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
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
import {
  calculatePasswordStrength,
  getPasswordStrengthPercentage,
} from '@/lib/utils/password-strength'

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
        // Redirect to OTP verification page for email confirmation, preserving plan if present
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        {loading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Mail className="size-4" />
                        )}
                      </InputGroupAddon>
                      <InputGroupInput
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        disabled={loading}
                      />
                      {field.value && !loading && (
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            onClick={() => form.setValue('email', '')}
                            aria-label="Clear email"
                          >
                            <X className="size-4" />
                          </InputGroupButton>
                        </InputGroupAddon>
                      )}
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name (Optional)</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Building2 className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="text"
                        placeholder="Your Company Inc."
                        {...field}
                        disabled={loading}
                      />
                      {field.value && !loading && (
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            onClick={() => form.setValue('companyName', '')}
                            aria-label="Clear company name"
                          >
                            <X className="size-4" />
                          </InputGroupButton>
                        </InputGroupAddon>
                      )}
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Lock className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...field}
                        disabled={loading}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  {field.value && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormDescription className={passwordStrength.color}>
                          {passwordStrength.feedback}
                        </FormDescription>
                        <InputGroupText className="text-xs">
                          {passwordStrength.score}/7
                        </InputGroupText>
                      </div>
                      <Progress
                        value={getPasswordStrengthPercentage(passwordStrength.score)}
                        className="h-1"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Lock className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...field}
                        disabled={loading}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={
                            showConfirmPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
  )
}
