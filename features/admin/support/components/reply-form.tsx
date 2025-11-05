'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Spinner } from '@/components/ui/spinner'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
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
import { replyToTicketSchema, type ReplyToTicketInput } from '../api/schema'
import { replyToTicketAction } from '../api/mutations'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

interface ReplyFormProps {
  ticketId: string
}

export function ReplyForm({ ticketId }: ReplyFormProps): React.JSX.Element {
  const router = useRouter()
  const form = useForm<ReplyToTicketInput>({
    resolver: zodResolver(replyToTicketSchema),
    defaultValues: {
      ticketId,
      message: '',
    },
  })

  async function onSubmit(data: ReplyToTicketInput): Promise<void> {
    const result = await replyToTicketAction(data)

    if ('error' in result) {
      toast.error('Failed to send reply', {
        description: result.error,
      })
    } else {
      toast.success('Reply sent successfully')
      form.reset({ ticketId, message: '' })
      router.refresh()
    }
  }

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Add Reply</ItemTitle>
        <ItemDescription>Continue the conversation with our support team</ItemDescription>
      </ItemHeader>
      <ItemContent className="basis-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet className="space-y-3">
              <FieldLegend>Reply message</FieldLegend>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormFieldLayout
                        label="Your Reply"
                        description={
                          <span className="flex items-center gap-1">
                            Press <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> to send
                          </span>
                        }
                      >
                        <FormControl>
                          <Textarea
                            placeholder="Type your reply here..."
                            className="min-h-32"
                            {...field}
                            onKeyDown={(e) => {
                              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                e.preventDefault()
                                form.handleSubmit(onSubmit)()
                              }
                            }}
                          />
                        </FormControl>
                      </FormFieldLayout>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <div className="flex gap-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Spinner /> : 'Send Reply'}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={form.formState.isSubmitting}
                onClick={() => form.reset({ ticketId, message: '' })}
              >
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </ItemContent>
    </Item>
  )
}
