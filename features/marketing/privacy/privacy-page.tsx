import { Item } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { siteConfig } from '@/lib/config/site.config'
import { privacyPageData } from './privacy-page.data'

export function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <SectionHeader
        title="Privacy Policy"
        description={`Last updated: ${privacyPageData.lastUpdated}`}
        align="start"
      />

      <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
        {privacyPageData.sections.map((section, idx) => (
          <Item key={idx} asChild className="block border-none rounded-none p-0 gap-0 text-base">
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">{section.title}</h2>
              {section.content && (
                <p className="text-muted-foreground">
                  {section.title === 'Introduction'
                    ? `${siteConfig.name} ("we," "our," or "us") ${section.content}`
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
                  <p className="mb-4 text-muted-foreground">{sub.content}</p>
                  {sub.list && (
                    <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                      {sub.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {sub.footer && <p className="mt-4 text-muted-foreground">{sub.footer}</p>}
                </div>
              ))}
            </section>
          </Item>
        ))}

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have questions about this Privacy Policy, please contact us at{' '}
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
