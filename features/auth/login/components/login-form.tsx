'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Item } from '@/components/ui/item'
import { FieldGroup } from '@/components/ui/field'
import { loginSchema, type LoginInput } from '../api/schema'
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
    <div className="flex flex-col gap-6 items-center">
      <Item variant="outline" className="overflow-hidden bg-card max-w-7xl w-full">
        <div className="grid p-0 md:grid-cols-2 gap-0 w-full">
          <FieldGroup className="gap-6 p-6 md:p-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-semibold">Welcome back</h1>
              <p className="text-muted-foreground text-sm text-balance">Sign in to manage your Zenith Sites subscription and support requests.</p>
            </div>

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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormFieldLayout label="Email">
                          <FormControl>
                            <ButtonGroup className="w-full">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="rounded-r-none bg-muted hover:bg-muted hover:text-muted-foreground"
                                disabled={loading}
                                aria-label="Email"
                              >
                                {loading ? <Spinner className="size-4" /> : <Mail className="size-4" />}
                              </Button>
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                className="rounded-r-md bg-background/50"
                                disabled={loading}
                                {...field}
                              />
                            </ButtonGroup>
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
                            <ButtonGroup className="w-full">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="rounded-r-none bg-muted hover:bg-muted hover:text-muted-foreground"
                                disabled={loading}
                                aria-label="Password"
                              >
                                <Lock className="size-4" />
                              </Button>
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="rounded-none border-r-0 bg-background/50"
                                disabled={loading}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="rounded-l-none border-l text-muted-foreground hover:text-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                              >
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                              </Button>
                            </ButtonGroup>
                          </FormControl>
                        </FormFieldLayout>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FieldGroup>

                <div className="flex justify-end">
                  <Button asChild variant="link" size="sm">
                    <Link href={ROUTES.RESET_PASSWORD}>Forgot password?</Link>
                  </Button>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Spinner /> : 'Sign in'}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-muted-foreground">Don&apos;t have an account?</span>
                  <Button asChild variant="link" size="sm">
                    <Link href={ROUTES.SIGNUP}>Sign up</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </FieldGroup>

          <div className="bg-muted relative hidden md:flex items-center rounded-md justify-center p-8 text-center">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Zenith Support</h2>
              <p className="text-muted-foreground text-sm text-balance">Access client dashboards, track site progress, and respond to tickets in one place.</p>
            </div>
          </div>
        </div>
      </Item>

      <p className="text-center text-sm text-muted-foreground">
        By signing in you agree to our <Link href={ROUTES.PRIVACY}>Privacy Policy</Link> and{' '}
        <Link href={ROUTES.TERMS}>Terms of Service</Link>.
      </p>
    </div>
  )
}
