import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site.config'

export const aboutPageMetadata: Metadata = {
  title: `About ${siteConfig.name}`,
  description:
    'Meet the Canadian team delivering subscription-based website design, development, and ongoing support for small businesses.',
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: `About ${siteConfig.name}`,
    description:
      'Learn how Zenith Strategic Solutions partners with Canadian businesses to launch and maintain high-performing websites.',
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    locale: 'en_CA',
    type: 'website',
  },
}
