export { AdminAuditLogsFeature } from './admin-audit-logs-feature'
export { AuditLogTable, CreateAuditLogForm } from './components'

// Client-safe API exports (mutations and schema only)
export * from './api/mutations'
export * from './api/schema'

// Server queries must be imported directly:
// import { getAuditLogs } from '@/features/admin/audit-logs/api/queries'
