'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface AdminRecentClientsProps {
  clients: Array<{
    id: string
    contact_name: string | null
    contact_email: string | null
    company_name: string | null
    created_at: string
  }>
}

export function AdminRecentClients({ clients }: AdminRecentClientsProps) {
  return (
    <Item variant="outline" className="flex flex-col">
      <ItemHeader className="gap-1">
        <ItemTitle>Recent Clients</ItemTitle>
        <ItemDescription>Latest registered client accounts</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {clients.length > 0 ? (
          <ScrollArea className="rounded-md border">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {client.contact_name?.charAt(0).toUpperCase() ?? 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{client.contact_name ?? 'Unknown'}</span>
                    </TableCell>
                    <TableCell>{client.contact_email}</TableCell>
                    <TableCell>{client.company_name ?? '—'}</TableCell>
                    <TableCell>
                      {new Date(client.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <Empty className="h-52">
            <EmptyHeader>
              <EmptyTitle>No clients yet</EmptyTitle>
              <EmptyDescription>Client accounts will appear here once registered</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ItemContent>
    </Item>
  )
}
