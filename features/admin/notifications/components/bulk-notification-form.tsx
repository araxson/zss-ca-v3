'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { bulkCreateNotificationSchema, type BulkCreateNotificationInput } from '../api/schema'
import { bulkCreateNotificationAction } from '../api/mutations'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
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

export function BulkNotificationForm(): React.JSX.Element {
  const router = useRouter()
  const [bulkResult, setBulkResult] = useState<{ error: string | null; success: boolean; count?: number } | null>(null)
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

  // Toast feedback on result change
  useEffect(() => {
    if (!bulkResult) return

    if (bulkResult.error) {
      toast.error('Failed to send notifications', {
        description: bulkResult.error,
      })
    } else if (bulkResult.success) {
      toast.success('Notifications sent successfully', {
        description: `Sent to ${bulkResult.count} client(s)`,
      })
      // Redirect after brief delay to allow toast to be seen
      setTimeout(() => {
        router.push(ROUTES.ADMIN_NOTIFICATIONS)
      }, 1000)
    }
  }, [bulkResult, router])

  async function onSubmit(data: BulkCreateNotificationInput): Promise<void> {
    setBulkResult(null)
    setIsSubmitting(true)

    try {
      const result = await bulkCreateNotificationAction(data)

      if ('error' in result && result.error !== null) {
        setBulkResult({ error: result.error, success: false })
        setIsSubmitting(false)
        return
      }

      if ('error' in result && result.error === null) {
        setBulkResult({ error: null, success: true, count: result.data.count })
      }
      form.reset()
      setIsSubmitting(false)
    } catch (_error) {
      setBulkResult({ error: 'An unexpected error occurred', success: false })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Screen reader announcement for form status */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isSubmitting && 'Sending notifications, please wait'}
        {!isSubmitting && bulkResult?.success && 'Notifications sent successfully'}
      </div>

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
