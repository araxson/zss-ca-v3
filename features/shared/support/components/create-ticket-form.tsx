'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Kbd } from '@/components/ui/kbd'
import { Spinner } from '@/components/ui/spinner'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { createTicketSchema, type CreateTicketInput } from '../schema'
import { createTicketAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'

const categoryOptions = [
  {
    value: 'technical',
    label: 'Technical Issue',
    description: 'Platform bug or outage affecting your site.',
  },
  {
    value: 'content_change',
    label: 'Content Change',
    description: 'Updates to text, images, or layout requests.',
  },
  {
    value: 'billing',
    label: 'Billing Question',
    description: 'Invoice questions or payment concerns.',
  },
  {
    value: 'general_inquiry',
    label: 'General Inquiry',
    description: 'Anything else you want to discuss.',
  },
] as const

const priorityOptions = [
  {
    value: 'low',
    label: 'Low',
    description: 'Minor requests or informational updates.',
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Important updates that impact timelines.',
  },
  {
    value: 'high',
    label: 'High',
    description: 'Urgent issues blocking your site or launch.',
  },
] as const

export function CreateTicketForm() {
  const router = useRouter()
  const form = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: '',
      message: '',
      category: 'general_inquiry',
      priority: 'medium',
    },
  })

  async function onSubmit(data: CreateTicketInput) {
    const result = await createTicketAction(data)

    if (result.error) {
      toast.error('Failed to create ticket', {
        description: result.error,
      })
    } else {
      toast.success('Ticket created successfully', {
        description: 'We will respond to your ticket as soon as possible.',
      })
      form.reset()
      router.push(ROUTES.CLIENT_SUPPORT)
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Support Ticket</CardTitle>
        <CardDescription>
          We&apos;ll respond to your ticket as soon as possible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet className="space-y-4">
              <FieldLegend>Ticket summary</FieldLegend>
              <FieldGroup className="space-y-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <MessageSquare className="size-4" />
                          </InputGroupAddon>
                          <InputGroupInput placeholder="Brief description of your issue" {...field} />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSet className="space-y-4">
              <FieldLegend>Routing details</FieldLegend>
              <FieldDescription>Select the category and urgency so support can triage faster.</FieldDescription>
              <FieldGroup className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-2"
                        >
                          {categoryOptions.map((option) => (
                            <Label key={option.value} htmlFor={option.value} className="cursor-pointer">
                              <Item variant="outline" size="sm" className="items-center gap-3">
                                <ItemMedia>
                                  <RadioGroupItem value={option.value} id={option.value} />
                                </ItemMedia>
                                <ItemContent>
                                  <ItemTitle>{option.label}</ItemTitle>
                                  <ItemDescription>{option.description}</ItemDescription>
                                </ItemContent>
                              </Item>
                            </Label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-2"
                        >
                          {priorityOptions.map((option) => (
                            <Label key={option.value} htmlFor={option.value} className="cursor-pointer">
                              <Item variant="outline" size="sm" className="items-center gap-3">
                                <ItemMedia>
                                  <RadioGroupItem value={option.value} id={option.value} />
                                </ItemMedia>
                                <ItemContent>
                                  <ItemTitle>{option.label}</ItemTitle>
                                  <ItemDescription>{option.description}</ItemDescription>
                                </ItemContent>
                              </Item>
                            </Label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide as much detail as possible"
                      className="min-h-40"
                      {...field}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                          e.preventDefault()
                          form.handleSubmit(onSubmit)()
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription className="flex flex-col gap-1">
                    <span>Include any relevant details, error messages, or screenshots</span>
                    <span className="flex items-center gap-1 text-xs">
                      Press <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> to submit
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonGroup>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Spinner /> : 'Create Ticket'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
