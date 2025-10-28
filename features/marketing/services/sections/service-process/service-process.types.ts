export interface ServiceProcessPhase {
  id: number
  label: string
  title: string
  description: string
}

export interface ServiceProcessData {
  heading: string
  subheading?: string
  phases: ServiceProcessPhase[]
}
