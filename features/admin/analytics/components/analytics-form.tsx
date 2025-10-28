'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createAnalyticsSchema, type CreateAnalyticsInput } from '../schema'
import { createAnalyticsAction } from '../api/mutations'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { ROUTES } from '@/lib/constants/routes'
import { AnalyticsFormSelectionFields } from './analytics-form-selection-fields'
import { AnalyticsFormMetricsFields } from './analytics-form-metrics-fields'

type AnalyticsFormProps = {
  sites: Array<{
    id: string
    site_name: string
    profile: {
      contact_name: string | null
      contact_email: string | null
    }
  }>
}

export function AnalyticsForm({ sites }: AnalyticsFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateAnalyticsInput>({
    resolver: zodResolver(createAnalyticsSchema),
    defaultValues: {
      client_site_id: '',
      metric_date: new Date().toISOString().split('T')[0],
      page_views: 0,
      unique_visitors: 0,
      conversions: 0,
      metadata: {},
    },
  })

  async function onSubmit(data: CreateAnalyticsInput) {
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await createAnalyticsAction(data)

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      form.reset()
      router.push(ROUTES.ADMIN_SITES)
      router.refresh()
    } catch (_error) {
      setError('An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Add Analytics Data"
        description="Manually add analytics data for a client site"
        align="start"
      />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Submission failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="space-y-6 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AnalyticsFormSelectionFields control={form.control} sites={sites} />
              <AnalyticsFormMetricsFields control={form.control} />

              <ButtonGroup>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : 'Add Analytics Data'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
