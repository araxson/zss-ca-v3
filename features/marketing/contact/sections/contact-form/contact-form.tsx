'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Item } from '@/components/ui/item'
import { Form } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { SectionHeader } from '@/features/shared/components'
import { contactFormSchema, type ContactFormInput } from '../../api/schema'
import { submitContactForm } from '../../api/mutations'
import { contactFormData } from './contact-form.data'
import { ContactFormFields } from './contact-form-fields'

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
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
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
              <ContactFormFields form={form} />

              {form.formState.errors.root && (
                <Alert variant="destructive" aria-live="assertive">
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
    </Item>
  )
}
