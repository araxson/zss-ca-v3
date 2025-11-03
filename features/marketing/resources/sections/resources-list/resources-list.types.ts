import type { LucideIcon } from 'lucide-react'

export interface ResourceItem {
  id: string
  title: string
  description: string
  type: 'Guide' | 'Template' | 'Benchmark';
  link: string
  linkLabel?: string
  icon?: LucideIcon
  iconLabel?: string
}

export interface ResourcesListData {
  heading: string
  resources: ResourceItem[]
}
