import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site.config'

export const privacyPageMetadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${siteConfig.name}. Learn how we collect, use, and protect your personal information.`,
  openGraph: {
    title: 'Privacy Policy',
    description: `Privacy policy for ${siteConfig.name}`,
    type: 'website',
  },
}
