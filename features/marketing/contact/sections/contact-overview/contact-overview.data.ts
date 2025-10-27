import { Mail, Phone, MapPin } from 'lucide-react'
import { siteConfig } from '@/lib/config/site.config'
import type { ContactOverviewData } from './contact-overview.types'

const { contact } = siteConfig

export const contactOverviewData: ContactOverviewData = {
  heading: "Let's build your next website",
  subheading:
    "Share your project goals and we’ll craft a subscription plan that keeps your site performing month after month.",
  channels: [
    {
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: Mail,
    },
    {
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone.replace(/[^+\d]/g, '')}`,
      icon: Phone,
    },
  ],
  office: {
    addressLines: [
      contact.address.line1,
      `${contact.address.city}, ${contact.address.region} ${contact.address.postal}`,
      contact.address.country,
    ],
    hours: 'Office hours: Monday–Friday, 9am–5pm MT',
  },
  cta: {
    label: 'Book a discovery call',
    href: `mailto:${contact.email}`,
  },
}

export const contactLocationIcon = MapPin
