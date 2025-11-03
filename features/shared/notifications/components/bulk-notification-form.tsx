'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { bulkCreateNotificationSchema, type BulkCreateNotificationInput } from '../api/schema'
import { bulkCreateNotificationAction } from '../api/mutations'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { BulkNotificationTypeField } from './bulk-notification-type-field'
import { BulkNotificationContentFields } from './bulk-notification-content-fields'
import { BulkNotificationFollowupFields } from './bulk-notification-followup-fields'

export function BulkNotificationForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BulkCreateNotificationInput>({
    resolver: zodResolver(bulkCreateNotificationSchema),
    defaultValues: {
      notification_type: 'system',
      title: '',
      body: null,
      action_url: null,
      expires_at: null,
      metadata: {},
    },
  })

  async function onSubmit(data: BulkCreateNotificationInput) {
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const result = await bulkCreateNotificationAction(data)

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      setSuccess(`Successfully sent notification to ${result.count} client(s)`)
      form.reset()
      setIsSubmitting(false)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(ROUTES.ADMIN_NOTIFICATIONS)
      }, 2000)
    } catch (_error) {
      setError('An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Item variant="muted">
        <ItemMedia>
          <Users className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Send to All Clients</ItemTitle>
          <ItemDescription>
            This notification will be sent to all active clients in the system
          </ItemDescription>
        </ItemContent>
      </Item>

      {error && (
        <Alert variant="destructive" aria-live="assertive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <Item variant="outline">
          <ItemContent className="basis-full">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
              <FieldSet className="space-y-4">
                <FieldLegend>Broadcast type</FieldLegend>
                <FieldGroup>
                  <BulkNotificationTypeField control={form.control} />
                </FieldGroup>
              </FieldSet>

              <FieldSet className="space-y-4">
                <FieldLegend>Content</FieldLegend>
                <FieldGroup className="space-y-4">
                  <BulkNotificationContentFields control={form.control} />
                </FieldGroup>
              </FieldSet>

              <FieldSet className="space-y-4">
                <FieldLegend>Follow-up</FieldLegend>
                <FieldDescription>
                  Optionally include a link and expiration for this announcement.
                </FieldDescription>
                <FieldGroup className="grid gap-4 sm:grid-cols-2">
                  <BulkNotificationFollowupFields control={form.control} />
                </FieldGroup>
              </FieldSet>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : 'Send to All Clients'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </ItemContent>
        </Item>
      </Form>
    </div>
  )
}
