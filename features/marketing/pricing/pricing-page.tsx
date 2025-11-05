import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { getActivePlans } from './api/queries'
import { PricingHero, PricingPlans } from './sections'
import { serviceSchema, generateBreadcrumbSchema } from '@/lib/config/structured-data'
import { siteConfig } from '@/lib/config/site.config'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export async function PricingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const plans = await getActivePlans()

  let hasSubscription = false
  if (user) {
    const { data: subscription } = await supabase
      .from('subscription')
      .select('id')
      .eq('profile_id', user.id)
      .in('status', ['active', 'trialing', 'past_due'])
      .maybeSingle()

    hasSubscription = Boolean(subscription)
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Pricing', url: `${siteConfig.url}/pricing` },
  ])

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
              <BreadcrumbPage>Pricing</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Choose the subscription that fits
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl text-balance">
              Monthly and annual plans crafted for ongoing website production and support.
            </p>
          </div>
        </div>
        <PricingPlans
          plans={plans}
          isAuthenticated={Boolean(user)}
          hasSubscription={hasSubscription}
        />
      </div>
    </>
  )
}
