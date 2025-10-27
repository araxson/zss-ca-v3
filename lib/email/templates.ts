import { siteConfig } from '../config/site.config'

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export function welcomeEmail(name: string): EmailTemplate {
  return {
    subject: `Welcome to ${siteConfig.name}!`,
    html: `
      <h1>Welcome to ${siteConfig.name}!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for signing up! We're excited to have you on board.</p>
      <p>Your account has been created and you can now access your client dashboard.</p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Best regards,<br>The ${siteConfig.name} Team</p>
    `,
    text: `Welcome to ${siteConfig.name}!\n\nHi ${name},\n\nThank you for signing up! We're excited to have you on board.\n\nYour account has been created and you can now access your client dashboard.\n\nIf you have any questions, feel free to contact our support team.\n\nBest regards,\nThe ${siteConfig.name} Team`,
  }
}

export function subscriptionCreatedEmail(
  name: string,
  planName: string,
  amount: number
): EmailTemplate {
  const formattedAmount = (amount / 100).toFixed(2)
  return {
    subject: 'Subscription Confirmed',
    html: `
      <h1>Subscription Confirmed</h1>
      <p>Hi ${name},</p>
      <p>Your subscription to the <strong>${planName}</strong> plan has been confirmed!</p>
      <p>Amount: $${formattedAmount} CAD</p>
      <p>You now have access to all features included in your plan. Our team will begin working on your website shortly.</p>
      <p>Best regards,<br>The ${siteConfig.name} Team</p>
    `,
    text: `Subscription Confirmed\n\nHi ${name},\n\nYour subscription to the ${planName} plan has been confirmed!\n\nAmount: $${formattedAmount} CAD\n\nYou now have access to all features included in your plan. Our team will begin working on your website shortly.\n\nBest regards,\nThe ${siteConfig.name} Team`,
  }
}

export function subscriptionCanceledEmail(name: string, planName: string): EmailTemplate {
  return {
    subject: 'Subscription Canceled',
    html: `
      <h1>Subscription Canceled</h1>
      <p>Hi ${name},</p>
      <p>Your subscription to the <strong>${planName}</strong> plan has been canceled.</p>
      <p>Your access will continue until the end of your current billing period.</p>
      <p>We're sorry to see you go. If you have any feedback, we'd love to hear it.</p>
      <p>Best regards,<br>The ${siteConfig.name} Team</p>
    `,
    text: `Subscription Canceled\n\nHi ${name},\n\nYour subscription to the ${planName} plan has been canceled.\n\nYour access will continue until the end of your current billing period.\n\nWe're sorry to see you go. If you have any feedback, we'd love to hear it.\n\nBest regards,\nThe ${siteConfig.name} Team`,
  }
}

export function supportTicketCreatedEmail(
  name: string,
  ticketId: string,
  subject: string
): EmailTemplate {
  return {
    subject: `Support Ticket Created: ${subject}`,
    html: `
      <h1>Support Ticket Created</h1>
      <p>Hi ${name},</p>
      <p>Your support ticket has been created successfully.</p>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p>Our support team will review your request and get back to you as soon as possible.</p>
      <p>You can view your ticket in your client dashboard.</p>
      <p>Best regards,<br>The ${siteConfig.name} Team</p>
    `,
    text: `Support Ticket Created\n\nHi ${name},\n\nYour support ticket has been created successfully.\n\nTicket ID: ${ticketId}\nSubject: ${subject}\n\nOur support team will review your request and get back to you as soon as possible.\n\nYou can view your ticket in your client dashboard.\n\nBest regards,\nThe ${siteConfig.name} Team`,
  }
}

export function supportTicketReplyEmail(
  name: string,
  ticketId: string,
  subject: string,
  replyMessage: string
): EmailTemplate {
  return {
    subject: `New Reply on Support Ticket: ${subject}`,
    html: `
      <h1>New Reply on Your Support Ticket</h1>
      <p>Hi ${name},</p>
      <p>You have received a new reply on your support ticket.</p>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Reply:</strong></p>
      <blockquote>${replyMessage}</blockquote>
      <p>You can view the full conversation in your client dashboard.</p>
      <p>Best regards,<br>The ${siteConfig.name} Team</p>
    `,
    text: `New Reply on Your Support Ticket\n\nHi ${name},\n\nYou have received a new reply on your support ticket.\n\nTicket ID: ${ticketId}\nSubject: ${subject}\n\nReply:\n${replyMessage}\n\nYou can view the full conversation in your client dashboard.\n\nBest regards,\nThe ${siteConfig.name} Team`,
  }
}

export function siteDeployedEmail(
  name: string,
  siteName: string,
  siteUrl: string
): EmailTemplate {
  return {
    subject: `Your Website is Live: ${siteName}`,
    html: `
      <h1>Your Website is Live!</h1>
      <p>Hi ${name},</p>
      <p>Great news! Your website <strong>${siteName}</strong> has been deployed and is now live.</p>
      <p><strong>Website URL:</strong> <a href="${siteUrl}">${siteUrl}</a></p>
      <p>You can now view your website and share it with your audience.</p>
      <p>If you need any changes or have questions, please create a support ticket in your dashboard.</p>
      <p>Best regards,<br>The ${siteConfig.name} Team</p>
    `,
    text: `Your Website is Live!\n\nHi ${name},\n\nGreat news! Your website ${siteName} has been deployed and is now live.\n\nWebsite URL: ${siteUrl}\n\nYou can now view your website and share it with your audience.\n\nIf you need any changes or have questions, please create a support ticket in your dashboard.\n\nBest regards,\nThe ${siteConfig.name} Team`,
  }
}

export function siteStatusChangedEmail(
  name: string,
  siteName: string,
  oldStatus: string,
  newStatus: string
): EmailTemplate {
  const formatStatus = (status: string) =>
    status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return {
    subject: `Website Status Update: ${siteName}`,
    html: `
      <h1>Website Status Update</h1>
      <p>Hi ${name},</p>
      <p>The status of your website <strong>${siteName}</strong> has been updated.</p>
      <p><strong>Previous Status:</strong> ${formatStatus(oldStatus)}</p>
      <p><strong>New Status:</strong> ${formatStatus(newStatus)}</p>
      <p>You can view more details in your client dashboard.</p>
      <p>Best regards,<br>The ${siteConfig.name} Team</p>
    `,
    text: `Website Status Update\n\nHi ${name},\n\nThe status of your website ${siteName} has been updated.\n\nPrevious Status: ${formatStatus(oldStatus)}\nNew Status: ${formatStatus(newStatus)}\n\nYou can view more details in your client dashboard.\n\nBest regards,\nThe ${siteConfig.name} Team`,
  }
}

export function passwordResetEmail(name: string, resetUrl: string): EmailTemplate {
  return {
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset Request</h1>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br>The ${siteConfig.name} Team</p>
    `,
    text: `Password Reset Request\n\nHi ${name},\n\nWe received a request to reset your password.\n\nClick the link below to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe ${siteConfig.name} Team`,
  }
}

export function otpEmail(otpCode: string, message: string, subject: string): EmailTemplate {
  return {
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 40px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
          .otp-box { background: #f3f4f6; border: 2px dashed #9ca3af; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #3b82f6; font-family: monospace; }
          .message { color: #6b7280; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; color: #92400e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">${siteConfig.name}</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Verification Code</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 10px;">${subject}</h2>
            <p class="message">${message}</p>

            <div class="otp-box">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">Your verification code is:</p>
              <div class="otp-code">${otpCode}</div>
            </div>

            <div class="warning">
              <strong>Security Notice:</strong> This code is confidential. Never share it with anyone. Our team will never ask for this code over phone or email.
            </div>

            <p style="color: #6b7280;">If you didn't request this code, please ignore this email or contact our support team if you have concerns.</p>

            <div class="footer">
              <p>Best regards,<br>The ${siteConfig.name} Team</p>
              <p style="font-size: 12px; color: #d1d5db;">This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `${subject}\n\n${message}\n\nYour verification code is: ${otpCode}\n\nSecurity Notice: This code is confidential. Never share it with anyone. Our team will never ask for this code over phone or email.\n\nIf you didn't request this code, please ignore this email or contact our support team if you have concerns.\n\nBest regards,\nThe ${siteConfig.name} Team`,
  }
}