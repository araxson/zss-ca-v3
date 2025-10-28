export interface HeroData {
  title: string
  description: string
  tagline: string
  ctaAriaLabel: string
  cta: {
    primary: {
      label: string
      href: string
    }
    secondary: {
      label: string
      href: string
    }
  }
}
