export interface ContactStep {
  id: number
  title: string
  description: string
}

export interface ContactStepsData {
  heading: string
  steps: ContactStep[]
}
