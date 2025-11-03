import { siteConfig } from '../config/site.config'

interface EmailTemplate {
  subject: string
  html: string
  text: string
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
