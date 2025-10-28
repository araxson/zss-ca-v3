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
import { updateSiteSchema, type UpdateSiteInput } from '../schema'
import { updateSiteAction } from '../api/mutations'
import { EditSiteStatusFields } from './edit-site-status-fields'
import { EditSiteDeploymentFields } from './edit-site-deployment-fields'
import type { Database } from '@/lib/types/database.types'

type ClientSite = Database['public']['Tables']['client_site']['Row']

interface EditSiteFormProps {
  site: ClientSite
  siteId: string
}

export function EditSiteForm({ site, siteId }: EditSiteFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const form = useForm<UpdateSiteInput>({
    resolver: zodResolver(updateSiteSchema),
    defaultValues: {
      site_name: site.site_name,
      status: site.status,
      deployment_url: site.deployment_url || '',
      custom_domain: site.custom_domain || '',
      deployment_notes: site.deployment_notes || '',
    },
  })

  async function onSubmit(data: UpdateSiteInput) {
    setError(null)
    const result = await updateSiteAction(siteId, data)

    if (result.error) {
      setError(result.error)
      return
    }

    router.refresh()
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" aria-live="assertive">
          <AlertTitle>Unable to save site</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="space-y-6 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <EditSiteStatusFields form={form} siteName={site.site_name} currentStatus={site.status} />
              <EditSiteDeploymentFields form={form} />
              <ButtonGroup>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Spinner /> : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={form.formState.isSubmitting}>
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
