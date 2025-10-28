export interface HomeSupportHighlight {
  eyebrow?: string
  title: string
  description: string
}

export interface HomeSupportData {
  heading: string
  subheading: string
  highlights: HomeSupportHighlight[]
  cta: {
    ariaLabel?: string
    label: string
    href: string
  }
}
