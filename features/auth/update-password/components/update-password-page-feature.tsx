'use client'

import { Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { UpdatePasswordForm } from './update-password-form'

export function UpdatePasswordPageFeature() {
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <Suspense
          fallback={(
            <Card className="border">
              <CardContent className="flex justify-center p-12">
                <Spinner className="size-6" />
              </CardContent>
            </Card>
          )}
        >
          <UpdatePasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
