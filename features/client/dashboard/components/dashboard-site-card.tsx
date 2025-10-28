'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { Progress } from '@/components/ui/progress'
import type { Database } from '@/lib/types/database.types'
import { getSiteStatusLabel, getSiteStatusProgress } from './dashboard-site-helpers'

type ClientSite = Database['public']['Tables']['client_site']['Row']

interface DashboardSiteCardProps {
  site: ClientSite
}

export function DashboardSiteCard({ site }: DashboardSiteCardProps) {
  const statusLabel = getSiteStatusLabel(site.status)
  const progress = getSiteStatusProgress(site.status)
  const destination = site.custom_domain ?? site.deployment_url ?? '#'
  const showVisitButton = site.status === 'live' && destination !== '#'

  return (
    <Item variant="outline">
      <ItemHeader>
        <div className="space-y-1">
          <ItemTitle>{site.site_name ?? 'Website'}</ItemTitle>
          <ItemDescription>
            {site.custom_domain ?? site.deployment_url ?? 'No domain yet'}
          </ItemDescription>
        </div>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge
              variant={
                site.status === 'live'
                  ? 'default'
                  : site.status === 'pending'
                    ? 'secondary'
                    : 'outline'
              }
            >
              {statusLabel}
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent className="w-64 space-y-2">
            <p className="text-sm font-medium">{statusLabel}</p>
            <p className="text-sm text-muted-foreground">
              {site.status === 'pending' &&
                'Your website is queued for development. Our team will begin work shortly.'}
              {site.status === 'in_production' &&
                'Your website is currently being developed by our team.'}
              {site.status === 'awaiting_client_content' &&
                'We need content from you to proceed. Please check your support tickets.'}
              {site.status === 'ready_for_review' &&
                'Your website is ready for your review. Please provide feedback.'}
              {site.status === 'live' &&
                'Your website is live and accessible to the public.'}
            </p>
            <p className="text-sm text-muted-foreground">Progress: {progress}%</p>
          </HoverCardContent>
        </HoverCard>
      </ItemHeader>

      <ItemContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">Deployment progress</div>
          <Badge variant="outline">{progress}%</Badge>
        </div>
        <ItemDescription>
          Track how far along this website is in the deployment process.
        </ItemDescription>
        <Progress value={progress} />
      </ItemContent>

      {showVisitButton && (
        <ItemFooter>
          <Button asChild variant="outline">
            <a href={destination} target="_blank" rel="noopener noreferrer">
              View site
            </a>
          </Button>
        </ItemFooter>
      )}
    </Item>
  )
}
