'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ROUTES } from '@/lib/constants/routes'
import { ClientDetailCard } from './client-detail-card'
import { EditClientForm } from './edit-client-form'
import { DeleteClientButton } from './delete-client-button'
import type { ClientProfile } from '../api/queries'

interface ClientDetailViewProps {
  client: ClientProfile | null
}

export function ClientDetailView({ client }: ClientDetailViewProps) {
  if (!client) {
    return (
      <Empty className="border border-dashed py-12">
        <EmptyHeader>
          <EmptyTitle>Client not found</EmptyTitle>
          <EmptyDescription>
            The requested client record could not be located. Double-check the link and try again.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex justify-center">
          <Button asChild>
            <Link href={ROUTES.ADMIN_CLIENTS}>
              <ArrowLeft className="mr-2 size-4" />
              Back to clients
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={ROUTES.ADMIN_DASHBOARD}>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={ROUTES.ADMIN_CLIENTS}>Clients</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{client.contact_name || 'Client'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-start justify-between gap-4 rounded-lg border p-6">
        <div className="flex items-start gap-4">
          <Avatar className="size-12">
            <AvatarFallback>
              {(client.contact_name || client.contact_email || 'C').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">{client.contact_name || 'Client Details'}</h1>
            <p className="text-muted-foreground">
              {client.contact_email ? (
                <a
                  href={`mailto:${client.contact_email}`}
                  className="hover:text-primary"
                  aria-label={`Email ${client.contact_name || client.company_name || 'client'}`}
                >
                  {client.contact_email}
                </a>
              ) : (
                'Email unavailable'
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
          <Button asChild variant="outline" size="sm">
            <Link href={ROUTES.ADMIN_CLIENTS}>
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Link>
          </Button>
        </div>
      </div>

      <ClientDetailCard client={client} />

      <div className="grid gap-6 lg:grid-cols-2">
        <EditClientForm client={client} />
        <DeleteClientButton
          clientId={client.id}
          clientName={client.contact_name || client.contact_email || 'this client'}
        />
      </div>
    </div>
  )
}
