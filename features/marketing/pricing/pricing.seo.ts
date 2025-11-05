import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site.config'

export const pricingPageMetadata: Metadata = {
  title: `Pricing | ${siteConfig.name}`,
  description:
    'Select a subscription that matches your roadmap. All plans include hosting, SSL, analytics, and ongoing support from our Canadian team.',
  alternates: {
    canonical: `${siteConfig.url}/pricing`,
  },
  openGraph: {
    title: `Pricing | ${siteConfig.name}`,
    description:
      'Transparent web design subscriptions with ongoing support for Canadian small businesses.',
    url: `${siteConfig.url}/pricing`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Pricing | ${siteConfig.name}`,
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Pricing | ${siteConfig.name}`,
    description:
      'Transparent web design subscriptions with ongoing support for Canadian small businesses.',
    images: [siteConfig.ogImage],
  },
}
