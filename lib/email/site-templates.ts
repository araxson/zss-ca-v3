import { siteConfig } from '../config/site.config'

interface EmailTemplate {
  subject: string
  html: string
  text: string
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
