'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createAnalyticsSchema, type CreateAnalyticsInput } from '../schema'
import { createAnalyticsAction } from '../api/mutations'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { ROUTES } from '@/lib/constants/routes'

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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Add Analytics Data</CardTitle>
        <CardDescription>
          Manually add analytics data for a client site
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Submission failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet className="space-y-4">
              <FieldLegend>Site selection</FieldLegend>
              <FieldDescription>
                Choose the site and date for the metrics you&apos;re recording.
              </FieldDescription>
              <FieldGroup className="space-y-4">
                <FormField
                  control={form.control}
                  name="client_site_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a site" />
                          </SelectTrigger>
                          <SelectContent>
                            {sites.map((site) => (
                              <SelectItem key={site.id} value={site.id}>
                                {site.site_name} ({site.profile.contact_name || site.profile.contact_email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metric_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>Date for these analytics metrics</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSet className="space-y-4">
              <FieldLegend>Performance metrics</FieldLegend>
              <FieldDescription>Record the key performance indicators for this day.</FieldDescription>
              <FieldGroup className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="page_views"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Views</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unique_visitors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unique Visitors</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conversions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conversions</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

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
  )
}
