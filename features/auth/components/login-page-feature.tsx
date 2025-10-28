import { LoginForm } from '@/features/auth'

export function LoginPageFeature() {
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
