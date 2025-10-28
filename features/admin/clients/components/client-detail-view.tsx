import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
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

      <Item variant="outline" className="bg-card">
        <ItemMedia>
          <Avatar>
            <AvatarFallback>
              {(client.contact_name || client.contact_email || 'C').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{client.contact_name || 'Client Details'}</ItemTitle>
          <ItemDescription>
            {client.contact_email ? (
              <a
                className="hover:text-primary"
                href={`mailto:${client.contact_email}`}
                aria-label={`Email ${client.contact_name || client.company_name || 'client'}`}
              >
                {client.contact_email}
              </a>
            ) : (
              'Email unavailable'
            )}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
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
        </ItemActions>
      </Item>

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
