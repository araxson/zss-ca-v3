import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>No audit logs found</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
        <CardDescription>
          Complete record of all actions performed in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
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
                <TableCell className="max-w-xs">
                  {log.change_summary && typeof log.change_summary === 'object' && (
                    <pre className="text-xs overflow-auto max-h-20">
                      {JSON.stringify(log.change_summary, null, 2)}
                    </pre>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
