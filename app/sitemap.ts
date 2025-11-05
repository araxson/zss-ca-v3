import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  // Marketing pages
  const marketingRoutes = [
    '',
    '/about',
    '/services',
    '/pricing',
    '/case-studies',
    '/resources',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Auth pages (lower priority)
  const authRoutes = ['/login', '/signup', '/reset-password'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  }))

  return [...marketingRoutes, ...authRoutes]
}
