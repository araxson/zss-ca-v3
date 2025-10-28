import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { SignupForm } from '@/features/auth'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ItemGroup className="w-full max-w-md space-y-6">
        <SectionHeader
          title="Create an account"
          description="Enter your details to create your account"
          align="start"
        />
        <Suspense
          fallback={
            <Item variant="outline" className="justify-center p-8">
              <ItemContent className="flex w-full justify-center">
                <Spinner className="size-6" />
              </ItemContent>
            </Item>
          }
        >
          <SignupForm />
        </Suspense>
      </ItemGroup>
    </div>
  )
}
