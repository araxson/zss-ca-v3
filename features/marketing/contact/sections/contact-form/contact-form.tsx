'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SectionHeader } from '@/features/shared/components'
import { contactFormSchema, type ContactFormInput } from '../../api/schema'
import { submitContactForm } from '../../api/mutations'
import { contactFormData } from './contact-form.data'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import { Spinner } from '@/components/ui/spinner'

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      companyName: '',
      phone: '',
      serviceInterest: 'website_build',
      message: '',
    },
  })

  async function onSubmit(data: ContactFormInput) {
    setIsSuccess(false)
    const result = await submitContactForm(data)

    if (result.error) {
      form.setError('root', { message: result.error })
    } else {
      setIsSuccess(true)
      form.reset()
    }
  }

  return (
    <section className="space-y-10">
      <SectionHeader
        title={contactFormData.heading}
        description={contactFormData.description}
        align="center"
      />

      <div className="mx-auto max-w-2xl">
        {isSuccess && (
          <Alert className="mb-6">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{contactFormData.successMessage}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLayout label="Full Name">
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                    </FormFieldLayout>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLayout label="Email">
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                    </FormFieldLayout>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLayout label="Company Name (Optional)">
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                    </FormFieldLayout>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLayout label="Phone (Optional)">
                      <FormControl>
                        <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                    </FormFieldLayout>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="serviceInterest"
              render={({ field }) => (
                <FormItem>
                  <FormFieldLayout label="Service Interest">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contactFormData.serviceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldLayout>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormFieldLayout label="Message">
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your project..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                  </FormFieldLayout>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="size-4" />
                  Sending
                </span>
              ) : (
                contactFormData.submitLabel
              )}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  )
}
