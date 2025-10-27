import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { AuditLogWithProfiles } from '../api/queries'

interface AuditLogTableProps {
  logs: AuditLogWithProfiles[]
}

function getActionVariant(action: string) {
  if (action.toLowerCase().includes('create') || action.toLowerCase().includes('insert')) {
    return 'default'
  }
  if (action.toLowerCase().includes('update')) {
    return 'secondary'
  }
  if (action.toLowerCase().includes('delete')) {
    return 'destructive'
  }
  return 'outline'
}

function formatResourceTable(table: string) {
  return table
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  if (logs.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyTitle>No audit activity yet</EmptyTitle>
          <EmptyDescription>Actions will appear here once the team starts making changes.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent />
      </Empty>
    )
  }

  return (
    <Item variant="outline" className="flex flex-col">
      <ItemHeader>
        <ItemTitle>Audit Logs</ItemTitle>
        <ItemDescription>
          Complete record of all actions performed in the system
        </ItemDescription>
      </ItemHeader>
      <ItemContent className="p-0">
        <ScrollArea className="rounded-md">
          <Table>
            <TableCaption>Chronological record of admin actions across the platform.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap">
                  <span className="text-xs">
                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {log.actor_profile?.contact_name || 'System'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {log.actor_profile?.contact_email || 'N/A'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getActionVariant(log.action)}>{log.action}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {formatResourceTable(log.resource_table)}
                    </span>
                    {log.resource_id && (
                      <span className="text-xs text-muted-foreground font-mono">
                        {log.resource_id.slice(0, 8)}...
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {log.change_summary && typeof log.change_summary === 'object' && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[500px]" align="end">
                        <div className="space-y-2">
                          <h4 className="font-medium">Change Summary</h4>
                          <pre className="text-xs overflow-auto max-h-96 rounded-md bg-muted p-4">
                            {JSON.stringify(log.change_summary, null, 2)}
                          </pre>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </ItemContent>
    </Item>
  )
}
