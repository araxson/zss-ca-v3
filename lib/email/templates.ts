/**
 * Email Templates - Barrel Export
 *
 * Re-exports all email templates from organized files.
 */

// Auth-related templates
export { welcomeEmail } from './auth-templates'

// Subscription templates
export { subscriptionCreatedEmail, subscriptionCanceledEmail } from './subscription-templates'

// Support templates
export { supportTicketCreatedEmail, supportTicketReplyEmail } from './support-templates'

// Site templates
export { siteDeployedEmail, siteStatusChangedEmail } from './site-templates'

// Notification templates (auth-related)
export { passwordResetEmail, otpEmail } from './notification-templates'