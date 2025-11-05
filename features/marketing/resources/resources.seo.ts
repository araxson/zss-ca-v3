import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site.config'

export const resourcesPageMetadata: Metadata = {
  title: `Resources | ${siteConfig.name}`,
  description:
    'Free guides, checklists, and best practices to help Canadian small businesses launch and scale their online presence.',
  alternates: {
    canonical: `${siteConfig.url}/resources`,
  },
  openGraph: {
    title: `Resources | ${siteConfig.name}`,
    description:
      'Guides, templates, and benchmarks from Zenith Strategic Solutions for modern website teams.',
    url: `${siteConfig.url}/resources`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Resources | ${siteConfig.name}`,
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Resources | ${siteConfig.name}`,
    description:
      'Guides, templates, and benchmarks from Zenith Strategic Solutions for modern website teams.',
    images: [siteConfig.ogImage],
  },
}
