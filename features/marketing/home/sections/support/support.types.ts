import type { LucideIcon } from 'lucide-react'

export interface HomeSupportHighlight {
  id: string
  eyebrow?: string
  title: string
  description: string
  icon?: LucideIcon
  iconLabel?: string
}

export interface HomeSupportData {
  heading: string
  subheading: string
  highlights: HomeSupportHighlight[]
  cta: {
    ariaLabel?: string
    label: string
    href: string
  }
}
