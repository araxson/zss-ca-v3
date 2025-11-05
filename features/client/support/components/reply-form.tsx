'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Kbd } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { replyToTicketAction } from '../api/mutations'
import { ReplySubmitButton } from './reply-submit-button'

interface ReplyFormProps {
  ticketId: string
}

export function ReplyForm({ ticketId }: ReplyFormProps): React.JSX.Element {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState(replyToTicketAction, {
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

  // Show toast and reset form on success/error
  useEffect(() => {
    if (!isPending && state) {
      if (state.error && !state.success) {
        toast.error('Failed to send reply', {
          description: state.error,
        })
      } else if (state.success) {
        toast.success('Reply sent successfully', {
          description: 'Your message has been added to the ticket.',
        })
        formRef.current?.reset()
        router.refresh()
      }
    }
  }, [state, isPending, router])

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Add Reply</ItemTitle>
        <ItemDescription>Continue the conversation with our support team</ItemDescription>
      </ItemHeader>
      <ItemContent className="basis-full">
        {/* Screen reader announcement for form status */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isPending && 'Sending reply, please wait'}
          {state?.success && 'Reply sent successfully'}
        </div>

        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="ticketId" value={ticketId} />

          <FieldSet className="space-y-3">
            <FieldLegend>Reply message</FieldLegend>
            <FieldGroup>
              <div>
                <Label htmlFor="message">
                  Your Reply
                  <span className="text-destructive" aria-label="required"> *</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  aria-required="true"
                  aria-invalid={!!getFieldError('message')}
                  aria-describedby={getFieldError('message') ? 'message-error message-hint' : 'message-hint'}
                  disabled={isPending}
                  placeholder="Type your reply here..."
                  className="min-h-32"
                  minLength={10}
                  maxLength={5000}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isPending) {
                      e.preventDefault()
                      formRef.current?.requestSubmit()
                    }
                  }}
                />
                <p id="message-hint" className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  Press <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> to send
                </p>
                {getFieldError('message') && (
                  <p id="message-error" className="text-sm text-destructive mt-1" role="alert">
                    {getFieldError('message')?.[0]}
                  </p>
                )}
              </div>
            </FieldGroup>
          </FieldSet>

          <div className="flex gap-2">
            <ReplySubmitButton />
            <Button type="reset" variant="outline" disabled={isPending}>
              Clear
            </Button>
          </div>
        </form>
      </ItemContent>
    </Item>
  )
}
