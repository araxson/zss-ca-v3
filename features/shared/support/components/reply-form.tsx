'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { replyToTicketSchema, type ReplyToTicketInput } from '../schema'
import { replyToTicketAction } from '../api/mutations'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

interface ReplyFormProps {
  ticketId: string
}

export function ReplyForm({ ticketId }: ReplyFormProps) {
  const router = useRouter()
  const form = useForm<ReplyToTicketInput>({
    resolver: zodResolver(replyToTicketSchema),
    defaultValues: {
      ticketId,
      message: '',
    },
  })

  async function onSubmit(data: ReplyToTicketInput) {
    const result = await replyToTicketAction(data)

    if (result.error) {
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
    <Card>
      <CardHeader>
        <CardTitle>Add Reply</CardTitle>
        <CardDescription>Continue the conversation with our support team</CardDescription>
      </CardHeader>
      <CardContent>
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

            <ButtonGroup>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
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
            </ButtonGroup>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
