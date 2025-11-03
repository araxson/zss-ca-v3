import { siteConfig } from '../config/site.config'

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export function passwordResetEmail(name: string, resetUrl: string): EmailTemplate {
  return {
    subject: 'Reset Your Password',
    html: `
      <h1>Reset Your Password</h1>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>The ${siteConfig.name} Team</p>
    `,
    text: `Reset Your Password\n\nHi ${name},\n\nWe received a request to reset your password.\n\nClick here to reset your password: ${resetUrl}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe ${siteConfig.name} Team`,
  }
}

export function otpEmail(otpCode: string, message: string, subject: string): EmailTemplate {
  return {
    subject,
    html: `
      <h1>${subject}</h1>
      <p>${message}</p>
      <p><strong>Your verification code:</strong></p>
      <h2>${otpCode}</h2>
      <p>This code will expire in 10 minutes.</p>
      <p>Best regards,<br>The ${siteConfig.name} Team</p>
    `,
    text: `${subject}\n\n${message}\n\nYour verification code: ${otpCode}\n\nThis code will expire in 10 minutes.\n\nBest regards,\nThe ${siteConfig.name} Team`,
  }
}
