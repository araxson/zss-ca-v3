import type { LucideIcon } from 'lucide-react'

export interface CaseStudyListItem {
  id: string
  name: string
  industry: string
  summary: string
  services: string[]
  icon?: LucideIcon
  iconLabel?: string
}

export interface CaseGridData {
  heading: string
  cases: CaseStudyListItem[]
}
