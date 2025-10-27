import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site.config'

export const homePageMetadata: Metadata = {
  title: `${siteConfig.name} - Professional Website Plans for Canadian Small Businesses`,
  description: siteConfig.description,
  keywords: [
    'website subscription',
    'small business websites',
    'Canadian web design',
    'website maintenance',
    'affordable websites',
    'website hosting',
    'professional web development',
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} - Professional Website Plans`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Professional Website Plans`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: siteConfig.url,
  },
}
