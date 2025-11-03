'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import type { Database } from '@/lib/types/database.types'
import { ROUTES } from '@/lib/constants/routes'
import { getStatusVariant, formatStatus } from '@/features/shared/utils'

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Profile = Database['public']['Tables']['profile']['Row']
type Plan = Database['public']['Tables']['plan']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row']

type SiteWithRelations = ClientSite & {
  profile: Pick<Profile, 'id' | 'contact_name' | 'contact_email' | 'company_name'>
  plan: Pick<Plan, 'id' | 'name' | 'slug'> | null
  subscription: Pick<Subscription, 'id' | 'status'> | null
}

interface SitesTableRowProps {
  site: SiteWithRelations
}

export function SitesTableRow({ site }: SitesTableRowProps) {
  const updatedAt = site.updated_at
    ? new Date(site.updated_at)
    : site.created_at
      ? new Date(site.created_at)
      : null

  return (
    <TableRow key={site.id}>
      <TableCell className="font-medium">{site.site_name}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <div className="text-sm">
            {site.profile.company_name || site.profile.contact_name}
          </div>
          <div className="text-xs text-muted-foreground">
            {site.profile.contact_email ? (
              <a
                className="hover:text-primary"
                href={`mailto:${site.profile.contact_email}`}
              >
                {site.profile.contact_email}
              </a>
            ) : (
              'No email'
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {site.plan ? (
          <Badge variant="outline" className="text-xs font-medium">
            {site.plan.name}
          </Badge>
        ) : (
          <div className="text-sm text-muted-foreground">No plan</div>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(site.status)}>
          {formatStatus(site.status)}
        </Badge>
      </TableCell>
      <TableCell>
        {site.deployment_url ? (
          <a
            href={site.deployment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            View Site
          </a>
        ) : (
          <div className="text-sm text-muted-foreground">Not deployed</div>
        )}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {updatedAt ? formatDistanceToNow(updatedAt, { addSuffix: true }) : '—'}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Manage ${site.site_name}`}
            >
              Manage
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Site actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/sites/${site.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${ROUTES.ADMIN_CLIENTS}?site=${site.id}`}>
                View client
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${ROUTES.ADMIN_SUPPORT}?site=${site.id}`}>
                Support tickets
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
