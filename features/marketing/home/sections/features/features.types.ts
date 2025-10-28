export interface Feature {
  id: string
  iconLabel?: string
  title: string
  description: string
  icon: string
}

export interface FeaturesData {
  heading: string
  subheading: string
  features: Feature[]
}
