import { Resend } from 'resend'

// Initialize with a placeholder if not set (for build time)
// The actual send functions will check for the key at runtime
export const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
