export { AuditLogTable, CreateAuditLogForm } from './components'

// Client-safe API exports (mutations and schema only)
export * from './api/mutations'
export * from './api/schema'

// Server queries must be imported directly:
// import { getAuditLogs } from '@/features/shared/audit-log/api/queries'
