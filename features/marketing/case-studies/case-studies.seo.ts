import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site.config'

export const caseStudiesPageMetadata: Metadata = {
  title: `Case Studies | ${siteConfig.name}`,
  description:
    'Explore website design and development wins for Canadian small businesses using Zenith Strategic Solutions subscriptions.',
  alternates: {
    canonical: `${siteConfig.url}/case-studies`,
  },
  openGraph: {
    title: `Case Studies | ${siteConfig.name}`,
    description:
      'How Canadian organizations launch, scale, and optimize their marketing sites with Zenith Strategic Solutions.',
    url: `${siteConfig.url}/case-studies`,
    siteName: siteConfig.name,
    locale: 'en_CA',
    type: 'website',
  },
}
