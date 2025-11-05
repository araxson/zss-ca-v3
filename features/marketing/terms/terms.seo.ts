import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site.config'

export const termsPageMetadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of service for ${siteConfig.name}. Review our terms and conditions for using our website development services.`,
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
  openGraph: {
    title: 'Terms of Service',
    description: `Terms of service for ${siteConfig.name}. Review our terms and conditions for using our website development services.`,
    url: `${siteConfig.url}/terms`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Terms of Service',
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service',
    description: `Terms of service for ${siteConfig.name}. Review our terms and conditions for using our website development services.`,
    images: [siteConfig.ogImage],
  },
}
