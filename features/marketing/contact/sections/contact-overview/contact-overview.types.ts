import type { LucideIcon } from 'lucide-react'

export interface ContactChannel {
  label: string
  value: string
  href: string
  icon: LucideIcon
}

export interface ContactOfficeDetails {
  addressLines: string[]
  hours: string
}

export interface ContactOverviewData {
  heading: string
  subheading: string
  channels: ContactChannel[]
  office: ContactOfficeDetails
  cta: {
    label: string
    href: string
  }
}
