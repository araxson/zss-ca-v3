'use client'

import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { UpdatePasswordForm } from '@/features/auth'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'

export function UpdatePasswordPageFeature() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ItemGroup className="w-full max-w-md space-y-6">
        <SectionHeader
          title="Set new password"
          description="Enter your new password to complete the reset process"
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
          <UpdatePasswordForm />
        </Suspense>
      </ItemGroup>
    </div>
  )
}
