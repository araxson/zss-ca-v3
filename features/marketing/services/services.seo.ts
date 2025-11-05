import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site.config'

export const servicesPageMetadata: Metadata = {
  title: `Services | ${siteConfig.name}`,
  description:
    'Subscription-based website design, development, and support for Canadian small businesses. See everything included in each plan.',
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
  openGraph: {
    title: `Services | ${siteConfig.name}`,
    description:
      'Partner with Zenith Strategic Solutions for ongoing website design, development, and optimization.',
    url: `${siteConfig.url}/services`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Services | ${siteConfig.name}`,
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Services | ${siteConfig.name}`,
    description:
      'Partner with Zenith Strategic Solutions for ongoing website design, development, and optimization.',
    images: [siteConfig.ogImage],
  },
}
