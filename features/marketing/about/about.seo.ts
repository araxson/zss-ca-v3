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
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `About ${siteConfig.name}`,
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `About ${siteConfig.name}`,
    description:
      'Learn how Zenith Strategic Solutions partners with Canadian businesses to launch and maintain high-performing websites.',
    images: [siteConfig.ogImage],
  },
}
