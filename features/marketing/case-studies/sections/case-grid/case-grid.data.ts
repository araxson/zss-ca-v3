import type { CaseGridData } from './case-grid.types'

export const caseGridData: CaseGridData = {
  heading: 'Recent launches',
  cases: [
    {
      id: 'prairie-clinic',
      name: 'Prairie Wellness Clinic',
      industry: 'Health & wellness',
      summary: 'Rebuilt their patient acquisition funnel with appointment integrations and accessibility-first design.',
      services: ['UX Strategy', 'Web Development', 'Analytics'],
    },
    {
      id: 'north-peak',
      name: 'North Peak Roofing',
      industry: 'Home services',
      summary: 'Localized SEO pages and seasonal landing campaigns that doubled quote requests in 60 days.',
      services: ['Marketing Site', 'SEO Foundations', 'Ongoing Support'],
    },
    {
      id: 'lumen-software',
      name: 'Lumen Software',
      industry: 'Tech / SaaS',
      summary: 'Launched a docs hub, marketing site, and changelog that ship in sync with their product team.',
      services: ['Design System', 'CMS Integration', 'Product Marketing'],
    },
    {
      id: 'harbour-legal',
      name: 'Harbour Legal',
      industry: 'Professional services',
      summary: 'Positioned a boutique legal firm with thought-leadership resources and lead routing automations.',
      services: ['Brand Refresh', 'Web Development', 'Content Enablement'],
    },
  ],
}
