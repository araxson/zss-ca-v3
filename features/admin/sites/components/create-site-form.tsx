'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Form } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { createSiteSchema, type CreateSiteInput } from '../schema'
import { createSiteAction } from '../api/mutations'
import { CreateSiteClientFields } from './create-site-client-fields'
import { CreateSiteDetailFields } from './create-site-detail-fields'
import type { Database } from '@/lib/types/database.types'
import { ROUTES } from '@/lib/constants/routes'

type Client = {
  id: string
  contact_name: string | null
  contact_email: string | null
  company_name: string | null
}

type Plan = Database['public']['Tables']['plan']['Row']

interface CreateSiteFormProps {
  clients: Client[]
  plans: Plan[]
}

export function CreateSiteForm({ clients, plans }: CreateSiteFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const form = useForm({
    resolver: zodResolver(createSiteSchema),
    defaultValues: {
      profile_id: '',
      site_name: '',
      plan_id: '',
      subscription_id: '',
      design_brief: { notes: '' },
    },
  })

  async function onSubmit(data: CreateSiteInput) {
    setError(null)
    const result = await createSiteAction(data)

    if (result.error) {
      setError(result.error)
      return
    }

    form.reset()
    router.push(ROUTES.ADMIN_SITES)
    router.refresh()
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" aria-live="assertive">
          <AlertTitle>Unable to create site</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="space-y-6 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CreateSiteClientFields form={form} clients={clients} plans={plans} />
              <CreateSiteDetailFields form={form} />
              <ButtonGroup>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Spinner /> : 'Create Site'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </ButtonGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
