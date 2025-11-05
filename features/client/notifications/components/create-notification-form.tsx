'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item'
import { createNotificationAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'
import { CreateNotificationSubmitButton } from './create-notification-submit-button'

type CreateNotificationFormProps = {
  clients: Array<{
    id: string
    contact_name: string | null
    contact_email: string | null
  }>
}

export function CreateNotificationForm({ clients }: CreateNotificationFormProps): React.JSX.Element {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createNotificationAction, {
    error: null,
    success: true,
    fieldErrors: {},
  })

  // Helper function to safely access field errors
  const getFieldError = (fieldName: string): string[] | undefined => {
    if (state?.fieldErrors && fieldName in state.fieldErrors) {
      return (state.fieldErrors as Record<string, string[]>)[fieldName]
    }
    return undefined
  }

  useEffect(() => {
    if (!isPending && state) {
      if (state.error && !state.success) {
        toast.error('Failed to create notification', {
          description: state.error,
        })
      } else if (state.success) {
        toast.success('Notification created', {
          description: 'Redirecting...',
        })
        const timer = setTimeout(() => {
          router.push(ROUTES.ADMIN_NOTIFICATIONS)
        }, 1500)
        return () => clearTimeout(timer)
      }
    }
    return undefined
  }, [state, isPending, router])

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
          {isPending && 'Creating notification, please wait'}
          {state?.success && 'Notification created successfully'}
        </div>

        <form action={formAction} className="space-y-6">
          <FieldSet className="space-y-4">
            <FieldLegend>Recipient</FieldLegend>
            <FieldGroup>
              <div>
                <Label htmlFor="profile_id">
                  Select Client
                  <span className="text-destructive" aria-label="required"> *</span>
                </Label>
                <Select name="profile_id" required disabled={isPending}>
                  <SelectTrigger
                    id="profile_id"
                    aria-required="true"
                    aria-invalid={!!getFieldError('profile_id')}
                    aria-describedby={getFieldError('profile_id') ? 'profile_id-error' : undefined}
                  >
                    <SelectValue placeholder="Choose a client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.contact_name || client.contact_email || 'Unknown'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError('profile_id') && (
                  <p id="profile_id-error" className="text-sm text-destructive mt-1" role="alert">
                    {getFieldError('profile_id')?.[0]}
                  </p>
                )}
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet className="space-y-4">
            <FieldLegend>Notification Type</FieldLegend>
            <FieldGroup>
              <div>
                <Label htmlFor="notification_type">
                  Type
                  <span className="text-destructive" aria-label="required"> *</span>
                </Label>
                <Select name="notification_type" defaultValue="system" required disabled={isPending}>
                  <SelectTrigger
                    id="notification_type"
                    aria-required="true"
                    aria-invalid={!!getFieldError('notification_type')}
                    aria-describedby={getFieldError('notification_type') ? 'notification_type-error' : undefined}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="site_update">Site Update</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                {getFieldError('notification_type') && (
                  <p id="notification_type-error" className="text-sm text-destructive mt-1" role="alert">
                    {getFieldError('notification_type')?.[0]}
                  </p>
                )}
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet className="space-y-4">
            <FieldLegend>Content</FieldLegend>
            <FieldGroup className="space-y-4">
              <div>
                <Label htmlFor="title">
                  Title
                  <span className="text-destructive" aria-label="required"> *</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={!!getFieldError('title')}
                  aria-describedby={getFieldError('title') ? 'title-error' : undefined}
                  disabled={isPending}
                  placeholder="Notification title"
                  maxLength={200}
                />
                {getFieldError('title') && (
                  <p id="title-error" className="text-sm text-destructive mt-1" role="alert">
                    {getFieldError('title')?.[0]}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="body">Body (Optional)</Label>
                <Textarea
                  id="body"
                  name="body"
                  aria-invalid={!!getFieldError('body')}
                  aria-describedby={getFieldError('body') ? 'body-error' : undefined}
                  disabled={isPending}
                  placeholder="Additional details..."
                  className="min-h-24"
                  maxLength={2000}
                />
                {getFieldError('body') && (
                  <p id="body-error" className="text-sm text-destructive mt-1" role="alert">
                    {getFieldError('body')?.[0]}
                  </p>
                )}
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet className="space-y-4">
            <FieldLegend>Follow-up</FieldLegend>
            <FieldDescription>Optionally include a link and expiration</FieldDescription>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="action_url">Action URL (Optional)</Label>
                <Input
                  id="action_url"
                  name="action_url"
                  type="url"
                  aria-invalid={!!getFieldError('action_url')}
                  aria-describedby={getFieldError('action_url') ? 'action_url-error' : undefined}
                  disabled={isPending}
                  placeholder="https://example.com"
                />
                {getFieldError('action_url') && (
                  <p id="action_url-error" className="text-sm text-destructive mt-1" role="alert">
                    {getFieldError('action_url')?.[0]}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="expires_at">Expires At (Optional)</Label>
                <Input
                  id="expires_at"
                  name="expires_at"
                  type="datetime-local"
                  aria-invalid={!!getFieldError('expires_at')}
                  aria-describedby={getFieldError('expires_at') ? 'expires_at-error' : undefined}
                  disabled={isPending}
                />
                {getFieldError('expires_at') && (
                  <p id="expires_at-error" className="text-sm text-destructive mt-1" role="alert">
                    {getFieldError('expires_at')?.[0]}
                  </p>
                )}
              </div>
            </FieldGroup>
          </FieldSet>

          <div className="flex gap-2">
            <CreateNotificationSubmitButton />
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </ItemContent>
    </Item>
  )
}
