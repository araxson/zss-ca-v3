'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { createNotificationSchema, type CreateNotificationInput } from '../api/schema'
import { createNotificationAction } from '../api/mutations'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ROUTES } from '@/lib/constants/routes'
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item'
import { CreateNotificationFormRecipientFields } from './create-notification-form-recipient-fields'
import { CreateNotificationFormContentFields } from './create-notification-form-content-fields'
import { CreateNotificationFormFollowupFields } from './create-notification-form-followup-fields'

type CreateNotificationFormProps = {
  clients: Array<{
    id: string
    contact_name: string | null
    contact_email: string | null
  }>
}

export function CreateNotificationForm({ clients }: CreateNotificationFormProps): React.JSX.Element {
  const router = useRouter()
  const [createResult, setCreateResult] = useState<{ error: string | null; success: boolean } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateNotificationInput>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      profile_id: '',
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
    if (!createResult) return

    if (createResult.error) {
      toast.error('Failed to create notification', {
        description: createResult.error,
      })
    } else if (createResult.success) {
      toast.success('Notification created', {
        description: 'The notification has been sent successfully.',
      })
    }
  }, [createResult])

  async function onSubmit(data: CreateNotificationInput): Promise<void> {
    setCreateResult(null)
    setIsSubmitting(true)

    try {
      const result = await createNotificationAction(data)

      if ('error' in result) {
        setCreateResult({ error: result.error ?? 'An error occurred', success: false })
        setIsSubmitting(false)
        return
      }

      setCreateResult({ error: null, success: true })
      form.reset()
      router.push(ROUTES.ADMIN_NOTIFICATIONS)
    } catch (_error) {
      setCreateResult({ error: 'An unexpected error occurred', success: false })
      setIsSubmitting(false)
    }
  }

  return (
    <Item variant="outline" className="flex flex-col gap-4 p-6">
      <ItemHeader>
        <ItemTitle>Create Notification</ItemTitle>
        <ItemDescription>
          Send a custom notification to a client. This will appear in their dashboard.
        </ItemDescription>
      </ItemHeader>
      <ItemContent>
        {/* Screen reader announcement for form status */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isSubmitting && 'Form is submitting, please wait'}
          {!isSubmitting && createResult?.success && 'Notification created successfully'}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CreateNotificationFormRecipientFields control={form.control} clients={clients} />
            <CreateNotificationFormContentFields control={form.control} />
            <CreateNotificationFormFollowupFields control={form.control} />

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Create Notification'}
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
        </Form>
      </ItemContent>
    </Item>
  )
}
