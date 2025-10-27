export interface HomeSupportHighlight {
  title: string
  description: string
}

export interface HomeSupportData {
  heading: string
  subheading: string
  highlights: HomeSupportHighlight[]
  cta: {
    label: string
    href: string
  }
}
