import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site.config'

export const privacyPageMetadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${siteConfig.name}. Learn how we collect, use, and protect your personal information.`,
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
  openGraph: {
    title: 'Privacy Policy',
    description: `Privacy policy for ${siteConfig.name}. Learn how we collect, use, and protect your personal information.`,
    url: `${siteConfig.url}/privacy`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Privacy Policy',
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy',
    description: `Privacy policy for ${siteConfig.name}. Learn how we collect, use, and protect your personal information.`,
    images: [siteConfig.ogImage],
  },
}
