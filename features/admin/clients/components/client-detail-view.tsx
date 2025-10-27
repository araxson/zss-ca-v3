import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
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
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
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
              <ArrowLeft className="mr-2 h-4 w-4" />
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

      <Card className="bg-card">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.ADMIN_CLIENTS}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="space-y-1">
              <CardTitle>{client.contact_name || 'Client Details'}</CardTitle>
              <CardDescription>{client.contact_email}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

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
