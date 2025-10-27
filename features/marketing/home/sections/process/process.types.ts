export interface HomeProcessStep {
  id: number
  title: string
  description: string
}

export interface HomeProcessData {
  heading: string
  subheading: string
  steps: HomeProcessStep[]
}
