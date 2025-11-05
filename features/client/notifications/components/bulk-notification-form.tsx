'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Users } from 'lucide-react'
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
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { bulkCreateNotificationAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'
import { BulkNotificationSubmitButton } from './bulk-notification-submit-button'

export function BulkNotificationForm(): React.JSX.Element {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(bulkCreateNotificationAction, {
    error: null,
    success: true,
    data: { count: 0 },
    fieldErrors: {},
  })

  useEffect(() => {
    if (!isPending && state) {
      if (state.error && !(state && 'success' in state && state.success)) {
        toast.error('Failed to send notifications', {
          description: state.error,
        })
      } else if (state && 'success' in state && state.success) {
        toast.success('Notifications sent successfully', {
          description: `Successfully sent notification to ${state.data.count} client(s)`,
        })
        const timer = setTimeout(() => {
          router.push(ROUTES.ADMIN_NOTIFICATIONS)
        }, 2000)
        return () => clearTimeout(timer)
      }
    }
    return undefined
  }, [state, isPending, router])

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

      {/* Screen reader announcement for form status */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Sending notifications, please wait'}
        {state && 'success' in state && state.success && `Successfully sent notification to ${state.data.count} clients`}
      </div>

      <form action={formAction}>
        <Item variant="outline">
          <ItemContent className="basis-full">
            <div className="space-y-6 p-6">
              <FieldSet className="space-y-4">
                <FieldLegend>Broadcast type</FieldLegend>
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
                        aria-invalid={!!state?.fieldErrors?.['notification_type']}
                        aria-describedby={state?.fieldErrors?.['notification_type'] ? 'notification_type-error' : undefined}
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
                    {state?.fieldErrors?.['notification_type'] && (
                      <p id="notification_type-error" className="text-sm text-destructive mt-1" role="alert">
                        {state.fieldErrors['notification_type'][0]}
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
                      aria-invalid={!!state?.fieldErrors?.['title']}
                      aria-describedby={state?.fieldErrors?.['title'] ? 'title-error' : undefined}
                      disabled={isPending}
                      placeholder="Notification title"
                      maxLength={200}
                    />
                    {state?.fieldErrors?.['title'] && (
                      <p id="title-error" className="text-sm text-destructive mt-1" role="alert">
                        {state.fieldErrors['title'][0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="body">Body (Optional)</Label>
                    <Textarea
                      id="body"
                      name="body"
                      aria-invalid={!!state?.fieldErrors?.['body']}
                      aria-describedby={state?.fieldErrors?.['body'] ? 'body-error' : undefined}
                      disabled={isPending}
                      placeholder="Additional details..."
                      className="min-h-24"
                      maxLength={2000}
                    />
                    {state?.fieldErrors?.['body'] && (
                      <p id="body-error" className="text-sm text-destructive mt-1" role="alert">
                        {state.fieldErrors['body'][0]}
                      </p>
                    )}
                  </div>
                </FieldGroup>
              </FieldSet>

              <FieldSet className="space-y-4">
                <FieldLegend>Follow-up</FieldLegend>
                <FieldDescription>
                  Optionally include a link and expiration for this announcement.
                </FieldDescription>
                <FieldGroup className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="action_url">Action URL (Optional)</Label>
                    <Input
                      id="action_url"
                      name="action_url"
                      type="url"
                      aria-invalid={!!state?.fieldErrors?.['action_url']}
                      aria-describedby={state?.fieldErrors?.['action_url'] ? 'action_url-error' : undefined}
                      disabled={isPending}
                      placeholder="https://example.com"
                    />
                    {state?.fieldErrors?.['action_url'] && (
                      <p id="action_url-error" className="text-sm text-destructive mt-1" role="alert">
                        {state.fieldErrors['action_url'][0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="expires_at">Expires At (Optional)</Label>
                    <Input
                      id="expires_at"
                      name="expires_at"
                      type="datetime-local"
                      aria-invalid={!!state?.fieldErrors?.['expires_at']}
                      aria-describedby={state?.fieldErrors?.['expires_at'] ? 'expires_at-error' : undefined}
                      disabled={isPending}
                    />
                    {state?.fieldErrors?.['expires_at'] && (
                      <p id="expires_at-error" className="text-sm text-destructive mt-1" role="alert">
                        {state.fieldErrors['expires_at'][0]}
                      </p>
                    )}
                  </div>
                </FieldGroup>
              </FieldSet>

              <div className="flex gap-2">
                <BulkNotificationSubmitButton />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </ItemContent>
        </Item>
      </form>
    </div>
  )
}
