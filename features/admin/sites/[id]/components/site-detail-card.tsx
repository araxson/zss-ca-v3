'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Database } from '@/lib/types/database.types'
import { SiteDetailQuickStats } from './site-detail-quick-stats'
import { SiteDetailClientSection } from './site-detail-client-section'
import { SiteDetailTimelineSection } from './site-detail-timeline-section'
import { SiteDetailDeploymentSection } from './site-detail-deployment-section'
import { getStatusVariant, formatStatus } from '@/features/shared/utils'
import { formatDate as formatDateUtil } from '@/lib/utils'
import { EditSiteForm } from './edit-site-form'
import { DeploySiteForm } from './deploy-site-form'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { PencilLine, Rocket } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Profile = Database['public']['Tables']['profile']['Row']
type Plan = Database['public']['Tables']['plan']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row']

type SiteWithRelations = ClientSite & {
  profile: Pick<Profile, 'id' | 'contact_name' | 'contact_email' | 'company_name'>
  plan: Pick<Plan, 'id' | 'name' | 'slug'> | null
  subscription: Pick<Subscription, 'id' | 'status'> | null
}

interface SiteDetailCardProps {
  site: SiteWithRelations
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A'
  return formatDateUtil(dateString)
}

export function SiteDetailCard({ site }: SiteDetailCardProps): React.JSX.Element {
  // Calculate days since created using a stable approach
  const [daysSinceCreated] = React.useState(() => {
    return Math.floor(
      (Date.now() - new Date(site.created_at).getTime()) / (1000 * 60 * 60 * 24)
    )
  })

  const clientName = site.profile.company_name || site.profile.contact_name || ''

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="client">Client</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="deployment">Deployment</TabsTrigger>
        <TabsTrigger value="edit">Edit Site</TabsTrigger>
        <TabsTrigger value="deploy">Deploy Site</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <SiteDetailQuickStats
          daysSinceCreated={daysSinceCreated}
          clientName={clientName}
          planName={site.plan?.name || null}
          status={site.status}
          getStatusVariant={getStatusVariant}
          formatStatus={formatStatus}
        />
      </TabsContent>

      <TabsContent value="client" className="space-y-6">
        <SiteDetailClientSection profile={site.profile} plan={site.plan} />
      </TabsContent>

      <TabsContent value="timeline" className="space-y-6">
        <SiteDetailTimelineSection
          createdAt={site.created_at}
          updatedAt={site.updated_at}
          deployedAt={site.deployed_at}
          lastRevisionAt={site.last_revision_at}
          formatDate={formatDate}
        />
      </TabsContent>

      <TabsContent value="deployment" className="space-y-6">
        <SiteDetailDeploymentSection
          deploymentUrl={site.deployment_url}
          customDomain={site.custom_domain}
          slug={site.slug}
          deploymentNotes={site.deployment_notes}
          siteName={site.site_name}
        />
      </TabsContent>

      <TabsContent value="edit" className="space-y-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <PencilLine className="mr-2 size-4" aria-hidden="true" />
              Edit Site
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Edit {site.site_name}</SheetTitle>
              <SheetDescription>
                Update project status, deployment details, and key metadata.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <EditSiteForm site={site} siteId={site.id} />
            </div>
          </SheetContent>
        </Sheet>
      </TabsContent>

      <TabsContent value="deploy" className="space-y-4">
        {site.status === 'live' ? (
          <Alert>
            <AlertTitle>Deployment complete</AlertTitle>
            <AlertDescription>
              This site is already live. Use the Edit tab to update deployment details or notes.
            </AlertDescription>
          </Alert>
        ) : (
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Rocket className="mr-2 size-4" aria-hidden="true" />
                Deploy Site
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Deploy {site.site_name}</SheetTitle>
                <SheetDescription>
                  Provide the production URL and any launch notes before marking the project as live.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <DeploySiteForm siteId={site.id} siteName={site.site_name} isLive={false} />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </TabsContent>
    </Tabs>
  )
}
