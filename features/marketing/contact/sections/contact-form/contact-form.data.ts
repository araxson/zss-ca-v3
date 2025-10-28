import type { ContactFormData } from './contact-form.types'

export const contactFormData: ContactFormData = {
  heading: 'Get started today',
  description:
    'Fill out the form below and our team will respond within one business day.',
  submitLabel: 'Send message',
  successMessage: 'Thank you! We\'ll be in touch soon.',
  serviceOptions: [
    { value: 'website_build', label: 'Website Build' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'support', label: 'Technical Support' },
    { value: 'other', label: 'Other' },
  ],
}
