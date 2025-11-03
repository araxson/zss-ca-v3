import { formatDistanceToNow } from 'date-fns'
import { ScrollText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
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
          <EmptyMedia variant="icon">
            <ScrollText />
          </EmptyMedia>
          <EmptyTitle>No audit activity yet</EmptyTitle>
          <EmptyDescription>Actions will appear here once the team starts making changes.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent />
      </Empty>
    )
  }

  return (
    <ScrollArea className="rounded-md border" aria-label="Audit log table">
      <Table className="min-w-[700px] md:min-w-[800px]">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`View change summary for action ${log.action}`}
                      >
                        <Eye className="mr-2 size-4" />
                        View Details
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-screen max-w-md sm:max-w-lg" align="end">
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
  )
}
