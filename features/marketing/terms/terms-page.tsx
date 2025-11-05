import { Item } from '@/components/ui/item'
import { siteConfig } from '@/lib/config/site.config'
import { termsPageData } from './terms-page.data'

export function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <div className="flex flex-col items-start text-left gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Terms of Service
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
            Last updated: {termsPageData.lastUpdated}
          </p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
        {termsPageData.sections.map((section, idx) => (
          <Item key={idx} asChild className="block border-none rounded-none p-0 gap-0 text-base">
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">{section.title}</h2>
              {section.content && (
                <p className="text-muted-foreground">
                  {section.content.includes('services, you')
                    ? `${siteConfig.name}'s ${section.content}`
                    : section.content.includes('provides subscription')
                      ? `${siteConfig.name} ${section.content}`
                      : section.content.includes('shall not be liable')
                        ? section.content.replace('shall not be', `${siteConfig.name} shall not be`)
                        : section.content}
                </p>
              )}
              {section.list && (
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground mt-4">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {section.subsections?.map((sub, subIdx) => (
                <div key={subIdx} className={subIdx > 0 ? 'mt-6' : 'mt-4'}>
                  <h3 className="mb-3 text-xl font-semibold">{sub.title}</h3>
                  <p className="text-muted-foreground">{sub.content}</p>
                </div>
              ))}
            </section>
          </Item>
        ))}

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Contact Information</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms of Service, please contact us at{' '}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
