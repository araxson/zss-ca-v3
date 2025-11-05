import { CaseHero, CaseFeatured, CaseGrid, CaseCta } from './sections'
import { organizationSchema, generateBreadcrumbSchema } from '@/lib/config/structured-data'
import { siteConfig } from '@/lib/config/site.config'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function CaseStudiesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Case Studies', url: `${siteConfig.url}/case-studies` },
  ])

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Case Studies</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Results from real client engagements
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl text-balance">
              Explore how our subscription team launches and grows sites for Canadian service leaders.
            </p>
          </div>
        </div>
        <CaseFeatured />
        <CaseGrid />
        <CaseCta />
      </div>
    </>
  )
}
