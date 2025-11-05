'use server'

import { headers } from 'next/headers'
import { contactFormSchema } from '../schema'

// Simple rate limiting for contact form
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

async function rateLimit(identifier: string, maxRequests = 3, windowMs = 3600000) {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (record && now > record.resetAt) {
    rateLimitMap.delete(identifier)
  }

  const current = rateLimitMap.get(identifier)

  if (!current) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (current.count >= maxRequests) {
    return { allowed: false, resetAt: current.resetAt }
  }

  current.count++
  return { allowed: true }
}

async function getClientIdentifier() {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? 'unknown'
  return ip
}

export async function submitContactForm(
  prevState: { message?: string; errors?: Record<string, string[]>; success?: boolean } | null,
  formData: FormData
): Promise<{
  message?: string
  errors?: Record<string, string[]>
  success?: boolean
}> {
  // Rate limit by IP address - 3 submissions per hour
  const identifier = await getClientIdentifier()
  const rateCheck = await rateLimit(identifier, 3, 3600000)

  if (!rateCheck.allowed) {
    const minutesUntilReset = Math.ceil(
      ((rateCheck.resetAt ?? 0) - Date.now()) / 60000
    )
    return {
      message: `Too many submissions. Please try again in ${minutesUntilReset} minute(s).`,
    }
  }

  // Validate input with Zod
  const validatedFields = contactFormSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    companyName: formData.get('companyName') || undefined,
    phone: formData.get('phone') || undefined,
    serviceInterest: formData.get('serviceInterest'),
    message: formData.get('message'),
  })

  if (!validatedFields.success) {
    return {
      message: 'Please fix the errors below',
      errors: validatedFields.error.flatten().fieldErrors,
    }
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

  return {
    message: 'Thank you! We will be in touch soon.',
    success: true,
  }
}
