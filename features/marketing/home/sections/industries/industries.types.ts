import type { LucideIcon } from 'lucide-react'

export interface HomeIndustry {
  id: string
  name: string
  description: string
  icon: LucideIcon
  iconLabel: string
}

export interface HomeIndustriesData {
  heading: string
  industries: HomeIndustry[]
}
