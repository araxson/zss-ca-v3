export const notificationTypeOptions = [
  { value: 'subscription', label: 'Subscription', description: 'Plan changes or subscription updates.' },
  { value: 'billing', label: 'Billing', description: 'Payment reminders and invoice notices.' },
  { value: 'support', label: 'Support', description: 'Ticket updates and support outreach.' },
  { value: 'site_status', label: 'Site Status', description: 'Deployment and uptime alerts.' },
  { value: 'system', label: 'System', description: 'Platform-wide announcements.' },
  { value: 'onboarding', label: 'Onboarding', description: 'Guidance for new clients.' },
] as const
