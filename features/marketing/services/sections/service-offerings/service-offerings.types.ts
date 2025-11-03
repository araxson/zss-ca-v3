import type { LucideIcon } from 'lucide-react'

export interface ServiceOfferingFeature {
  title: string
  description: string
}

export interface ServiceOfferingCard {
  id: string
  title: string
  summary: string
  icon?: LucideIcon
  iconLabel?: string
  features: ServiceOfferingFeature[]
}

export interface ServiceOfferingsData {
  heading: string
  cards: ServiceOfferingCard[]
}
