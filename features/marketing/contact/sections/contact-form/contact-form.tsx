'use client'

import { useActionState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Item } from '@/components/ui/item'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { submitContactForm } from '../../api/mutations'
import { contactFormData } from './contact-form.data'
import { ContactFormSubmitButton } from './contact-form-submit-button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, {})
  const firstErrorRef = useRef<HTMLInputElement>(null)

  // Toast feedback and focus first error field after validation
  useEffect(() => {
    if (!isPending && state) {
      if (state.success) {
        toast.success('Message sent successfully', {
          description: 'Thank you for contacting us. We will get back to you soon.',
        })
      } else if (state.errors && Object.keys(state.errors).length > 0) {
        // Focus first error field
        if (firstErrorRef.current) {
          firstErrorRef.current.focus()
        }
      } else if (state.message && !state.success) {
        // Rate limit or other general errors
        toast.error('Failed to send message', {
          description: state.message,
        })
      }
    }
  }, [state, isPending])

  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-10">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {contactFormData.heading}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl text-balance">
              {contactFormData.description}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          {/* Screen reader announcement for form status */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {isPending && 'Form is submitting, please wait'}
            {state?.success && !isPending && state.message}
          </div>

          {/* Error summary for accessibility */}
          {hasErrors && state?.errors && (
            <Alert
              variant="destructive"
              role="alert"
              aria-live="assertive"
              className="mb-6"
              tabIndex={-1}
            >
              <AlertCircle className="size-4" aria-hidden="true" />
              <AlertTitle>Please fix the following errors</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {Object.entries(state.errors).map(([field, messages]) => (
                    <li key={field}>
                      <a
                        href={`#${field}`}
                        className="underline hover:no-underline"
                      >
                        {field === 'fullName' && 'Full Name'}
                        {field === 'email' && 'Email'}
                        {field === 'companyName' && 'Company Name'}
                        {field === 'phone' && 'Phone'}
                        {field === 'serviceInterest' && 'Service Interest'}
                        {field === 'message' && 'Message'}
                        : {(messages as string[])[0]}
                      </a>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <form action={formAction} className="space-y-6" aria-describedby={hasErrors ? 'form-errors' : undefined}>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                  Full Name
                  <span className="text-destructive" aria-label="required"> *</span>
                </label>
                <Input
                  ref={state?.errors?.['fullName'] ? firstErrorRef : null}
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  aria-required="true"
                  aria-invalid={!!state?.errors?.['fullName']}
                  aria-describedby={state?.errors?.['fullName'] ? 'fullName-error' : undefined}
                  disabled={isPending}
                  className={state?.errors?.['fullName'] ? 'border-destructive' : ''}
                />
                {state?.errors?.['fullName'] && (
                  <p id="fullName-error" className="text-sm text-destructive mt-1" role="alert">
                    {state.errors['fullName'][0]}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                  <span className="text-destructive" aria-label="required"> *</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  aria-required="true"
                  aria-invalid={!!state?.errors?.['email']}
                  aria-describedby={state?.errors?.['email'] ? 'email-error' : undefined}
                  disabled={isPending}
                  className={state?.errors?.['email'] ? 'border-destructive' : ''}
                />
                {state?.errors?.['email'] && (
                  <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
                    {state.errors['email'][0]}
                  </p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-2">
                  Company Name (Optional)
                </label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Acme Inc."
                  aria-invalid={!!state?.errors?.['companyName']}
                  aria-describedby={state?.errors?.['companyName'] ? 'companyName-error' : undefined}
                  disabled={isPending}
                  className={state?.errors?.['companyName'] ? 'border-destructive' : ''}
                />
                {state?.errors?.['companyName'] && (
                  <p id="companyName-error" className="text-sm text-destructive mt-1" role="alert">
                    {state.errors['companyName'][0]}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone (Optional)
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  aria-invalid={!!state?.errors?.['phone']}
                  aria-describedby={state?.errors?.['phone'] ? 'phone-error' : undefined}
                  disabled={isPending}
                  className={state?.errors?.['phone'] ? 'border-destructive' : ''}
                />
                {state?.errors?.['phone'] && (
                  <p id="phone-error" className="text-sm text-destructive mt-1" role="alert">
                    {state.errors['phone'][0]}
                  </p>
                )}
              </div>
            </div>

            {/* Service Interest */}
            <div>
              <label htmlFor="serviceInterest" className="block text-sm font-medium mb-2">
                Service Interest
                <span className="text-destructive" aria-label="required"> *</span>
              </label>
              <Select name="serviceInterest" defaultValue="website_build" disabled={isPending} required>
                <SelectTrigger
                  id="serviceInterest"
                  aria-required="true"
                  aria-invalid={!!state?.errors?.['serviceInterest']}
                  aria-describedby={state?.errors?.['serviceInterest'] ? 'serviceInterest-error' : undefined}
                  className={state?.errors?.['serviceInterest'] ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {contactFormData.serviceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.['serviceInterest'] && (
                <p id="serviceInterest-error" className="text-sm text-destructive mt-1" role="alert">
                  {state.errors['serviceInterest'][0]}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
                <span className="text-destructive" aria-label="required"> *</span>
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us about your project..."
                rows={6}
                required
                aria-required="true"
                aria-invalid={!!state?.errors?.['message']}
                aria-describedby={state?.errors?.['message'] ? 'message-error' : undefined}
                disabled={isPending}
                className={state?.errors?.['message'] ? 'border-destructive' : ''}
              />
              {state?.errors?.['message'] && (
                <p id="message-error" className="text-sm text-destructive mt-1" role="alert">
                  {state.errors['message'][0]}
                </p>
              )}
            </div>

            <ContactFormSubmitButton />
          </form>
        </div>
      </section>
    </Item>
  )
}
