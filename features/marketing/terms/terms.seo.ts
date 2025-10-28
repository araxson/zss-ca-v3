import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site.config'

export const termsPageMetadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of service for ${siteConfig.name}. Review our terms and conditions for using our website development services.`,
  openGraph: {
    title: 'Terms of Service',
    description: `Terms of service for ${siteConfig.name}`,
    type: 'website',
  },
}
