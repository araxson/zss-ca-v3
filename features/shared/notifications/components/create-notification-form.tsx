'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createNotificationSchema, type CreateNotificationInput } from '../schema'
import { createNotificationAction } from '../api/mutations'
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
import { Textarea } from '@/components/ui/textarea'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { User } from 'lucide-react'
import { notificationTypes } from './create-notification-form-data'

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
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet className="space-y-4">
              <FieldLegend>Recipient & Type</FieldLegend>
              <FieldDescription>Choose who receives this notification and how it is categorized.</FieldDescription>
              <FieldGroup className="space-y-4">
                <Item variant="outline" size="sm">
                  <ItemMedia>
                    <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{clients.length} clients available</ItemTitle>
                    <ItemDescription>Select a recipient or install a broadcast type.</ItemDescription>
                  </ItemContent>
                </Item>
                <FormField
                  control={form.control}
                  name="profile_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.contact_name || client.contact_email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notification_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {notificationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSet className="space-y-4">
              <FieldLegend>Content</FieldLegend>
              <FieldGroup className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Notification title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notification message"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>Additional details for the notification</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSet className="space-y-4">
              <FieldLegend>Follow-up</FieldLegend>
              <FieldDescription>Provide optional destination links or expiration rules.</FieldDescription>
              <FieldGroup className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4">
                <FormField
                  control={form.control}
                  name="action_url"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Action URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>Link for users to take action</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expires_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expires At (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>Notification will auto-hide after this date</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <ButtonGroup>
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
            </ButtonGroup>
          </form>
        </Form>
      </ItemContent>
    </Item>
  )
}
