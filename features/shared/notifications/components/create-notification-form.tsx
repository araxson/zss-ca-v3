'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createNotificationSchema, type CreateNotificationInput } from '../api/schema'
import { createNotificationAction } from '../api/mutations'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
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

export function CreateNotificationForm({ clients }: CreateNotificationFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
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

  async function onSubmit(data: CreateNotificationInput) {
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await createNotificationAction(data)

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      form.reset()
      router.push(ROUTES.ADMIN_NOTIFICATIONS)
    } catch (_error) {
      setError('An unexpected error occurred')
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
        {error && (
          <Alert variant="destructive" className="mb-6" aria-live="assertive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
