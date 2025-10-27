export interface ServiceProcessPhase {
  id: number
  title: string
  description: string
}

export interface ServiceProcessData {
  heading: string
  phases: ServiceProcessPhase[]
}
