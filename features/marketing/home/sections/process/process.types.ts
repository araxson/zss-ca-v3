export interface HomeProcessStep {
  id: number
  label: string
  title: string
  description: string
}

export interface HomeProcessData {
  heading: string
  subheading: string
  steps: HomeProcessStep[]
}
