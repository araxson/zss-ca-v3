import Link from 'next/link'
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
            <Users className="h-6 w-6" />
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
    <div className="border rounded-lg">
      <Table>
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
                <TableCell>{client.contact_email}</TableCell>
                <TableCell>{client.company_name || 'N/A'}</TableCell>
                <TableCell>
                  {client.subscription && client.subscription.plan ? (
                    <div className="text-sm">{client.subscription.plan.name}</div>
                  ) : (
                    <div className="text-sm text-muted-foreground">None</div>
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
                  {joinedDate.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/clients/${client.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
