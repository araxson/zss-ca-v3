'use server'

import { contactFormSchema, type ContactFormInput } from './schema'

export async function submitContactForm(input: ContactFormInput) {
  const validatedFields = contactFormSchema.safeParse(input)

  if (!validatedFields.success) {
    return { error: 'Invalid form data' }
  }

  const { fullName, email, companyName, phone, serviceInterest, message } =
    validatedFields.data

  // Log the contact form submission
  // In production, this should send an email notification to the admin team
  console.log('Contact Form Submission:', {
    name: fullName,
    email,
    company: companyName,
    phone,
    service: serviceInterest,
    message,
    timestamp: new Date().toISOString(),
  })

  // TODO: Implement email notification to admin team
  // Example: await sendEmail({
  //   to: process.env.ADMIN_EMAIL,
  //   subject: `New Contact Form: ${serviceInterest}`,
  //   body: message
  // })

  return { success: true }
}
