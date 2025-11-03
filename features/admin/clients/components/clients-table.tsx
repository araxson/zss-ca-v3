'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Users } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import type { ClientProfile } from '../api/queries'

interface ClientsTableProps {
  clients: ClientProfile[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users className="size-6" />
          </EmptyMedia>
          <EmptyTitle>No clients found</EmptyTitle>
          <EmptyDescription>
            Invite a client to get started or import records from an external source.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline" size="sm">
            <Link href={ROUTES.ADMIN_CLIENTS}>Invite Client</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <ScrollArea className="rounded-md border">
      <Table className="min-w-[620px] md:min-w-[720px]">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => {
            const joinedDate = new Date(client.created_at)

            return (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  {client.contact_name || 'N/A'}
                </TableCell>
                <TableCell>
                    {client.contact_email ? (
                      <a
                        className="hover:text-primary"
                        href={`mailto:${client.contact_email}`}
                        aria-label={`Email ${client.contact_name || client.company_name || 'client'}`}
                      >
                        {client.contact_email}
                      </a>
                    ) : (
                      'N/A'
                    )}
                </TableCell>
                <TableCell>{client.company_name || 'N/A'}</TableCell>
                <TableCell className="text-sm">
                  {client.subscription && client.subscription.plan ? (
                    <Badge variant="outline">{client.subscription.plan.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  {client.subscription ? (
                    <Badge
                      variant={
                        client.subscription.status === 'active'
                          ? 'default'
                          : client.subscription.status === 'past_due'
                            ? 'destructive'
                            : 'secondary'
                      }
                    >
                      {client.subscription.status}
                    </Badge>
                  ) : (
                    <Badge variant="outline">No subscription</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div className="flex flex-col">
                    <span>{joinedDate.toLocaleDateString()}</span>
                    <span className="text-xs">{formatDistanceToNow(joinedDate, { addSuffix: true })}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Manage ${client.contact_name || client.company_name || 'client'}`}
                      >
                        Manage
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Client actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/clients/${client.id}`}>View details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`${ROUTES.ADMIN_SITES}?client=${client.id}`}>
                          View sites
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`${ROUTES.ADMIN_SUPPORT}?client=${client.id}`}>
                          Support history
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
