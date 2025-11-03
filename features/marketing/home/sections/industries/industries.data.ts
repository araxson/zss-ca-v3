import { Briefcase, Hammer, Rocket, Stethoscope } from 'lucide-react'
import type { HomeIndustriesData } from './industries.types'

export const homeIndustriesData: HomeIndustriesData = {
  heading: 'Built for service-driven teams',
  industries: [
    {
      id: 'professional-services',
      name: 'Professional services',
      description: 'Consultants, accountants, and legal teams that need conversion-optimized landing pages.',
      icon: Briefcase,
      iconLabel: 'Professional services icon',
    },
    {
      id: 'home-services',
      name: 'Home & trade services',
      description: 'Contractors and home service brands needing localized SEO and frictionless lead funnels.',
      icon: Hammer,
      iconLabel: 'Home services icon',
    },
    {
      id: 'health-wellness',
      name: 'Health & wellness',
      description: 'Clinics and wellness businesses requiring HIPAA-conscious intake forms and booking flows.',
      icon: Stethoscope,
      iconLabel: 'Health and wellness icon',
    },
    {
      id: 'tech-startups',
      name: 'Tech & SaaS',
      description: 'Early-stage teams that want marketing, documentation, and changelog sites without hiring in-house.',
      icon: Rocket,
      iconLabel: 'Tech icon',
    },
  ],
}
