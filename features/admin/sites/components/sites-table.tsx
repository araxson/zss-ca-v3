'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Globe } from 'lucide-react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { Database } from '@/lib/types/database.types'
import { ROUTES } from '@/lib/constants/routes'
import { SitesTableRow } from './sites-table-row'

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Profile = Database['public']['Tables']['profile']['Row']
type Plan = Database['public']['Tables']['plan']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row']

type SiteWithRelations = ClientSite & {
  profile: Pick<Profile, 'id' | 'contact_name' | 'contact_email' | 'company_name'>
  plan: Pick<Plan, 'id' | 'name' | 'slug'> | null
  subscription: Pick<Subscription, 'id' | 'status'> | null
}

interface SitesTableProps {
  sites: SiteWithRelations[]
}

export function SitesTable({ sites }: SitesTableProps) {
  if (sites.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Globe className="size-6" />
          </EmptyMedia>
          <EmptyTitle>No sites found</EmptyTitle>
          <EmptyDescription>
            Create a site to get started or import an existing deployment.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline" size="sm">
            <Link href={`${ROUTES.ADMIN_SITES}/new`}>Create Site</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <ScrollArea className="rounded-md border">
      <Table className="min-w-[700px] md:min-w-[900px]">
        <TableHeader>
          <TableRow>
            <TableHead>Site Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deployed URL</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((site) => (
            <SitesTableRow key={site.id} site={site} />
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
