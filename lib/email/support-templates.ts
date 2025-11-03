import { siteConfig } from '../config/site.config'

interface EmailTemplate {
  subject: string
  html: string
  text: string
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
