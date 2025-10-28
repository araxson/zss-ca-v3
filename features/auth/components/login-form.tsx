'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { Mail, Lock, Eye, EyeOff, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { FieldDescription, FieldGroup } from '@/components/ui/field'
import { loginSchema, type LoginInput } from '../schema'
import { loginAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginInput) {
    setLoading(true)
    setError(null)
    try {
      const result = await loginAction(data)
      if (result?.error) {
        setError(result.error)
        toast.error('Login failed', {
          description: result.error,
        })
        setLoading(false)
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        return
      }
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast.error('Login failed', {
        description: message,
      })
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
                <h1 className="text-2xl font-semibold">Welcome back</h1>
                <p className="text-muted-foreground text-sm text-balance">Sign in to manage your Zenith Sites subscription and support requests.</p>
              </div>

              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FieldGroup className="gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormFieldLayout label="Email">
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
                                  disabled={loading}
                                  {...field}
                                />
                                {field.value && !loading ? (
                                  <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                      type="button"
                                      onClick={() => form.setValue('email', '')}
                                      aria-label="Clear email"
                                    >
                                      <X className="size-4" />
                                    </InputGroupButton>
                                  </InputGroupAddon>
                                ) : null}
                              </InputGroup>
                            </FormControl>
                          </FormFieldLayout>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormFieldLayout label="Password">
                            <FormControl>
                              <InputGroup>
                                <InputGroupAddon>
                                  <Lock className="size-4" />
                                </InputGroupAddon>
                                <InputGroupInput
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="••••••••"
                                  disabled={loading}
                                  {...field}
                                />
                                <InputGroupAddon align="inline-end">
                                  <InputGroupButton
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                  >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                  </InputGroupButton>
                                </InputGroupAddon>
                              </InputGroup>
                            </FormControl>
                          </FormFieldLayout>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FieldGroup>

                  <ButtonGroup
                    aria-label="Login helpers"
                    className="justify-end gap-0 [&>*:not(:first-child)]:-ml-px"
                  >
                    <Button asChild variant="link" size="sm">
                      <Link href={ROUTES.RESET_PASSWORD}>Forgot password?</Link>
                    </Button>
                  </ButtonGroup>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Spinner /> : 'Sign in'}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-muted-foreground">Don&apos;t have an account?</span>
                    <ButtonGroup className="gap-0 [&>*:not(:first-child)]:-ml-px">
                      <Button asChild variant="link" size="sm">
                        <Link href={ROUTES.SIGNUP}>Sign up</Link>
                      </Button>
                    </ButtonGroup>
                  </div>
                </form>
              </Form>
            </FieldGroup>
          </div>

          <div className="bg-muted relative hidden min-h-[320px] md:flex items-center justify-center p-8 text-center">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Zenith Support</h2>
              <p className="text-muted-foreground text-sm text-balance">Access client dashboards, track site progress, and respond to tickets in one place.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        By signing in you agree to our <Link href={ROUTES.PRIVACY}>Privacy Policy</Link> and{' '}
        <Link href={ROUTES.TERMS}>Terms of Service</Link>.
      </p>
    </div>
  )
}
