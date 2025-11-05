/**
 * Layout Components
 *
 * Organized layout components for different areas of the application:
 * - dashboard/ - Dashboard layouts for admin and client portals
 * - marketing/ - Public-facing marketing header and footer
 * - shared/ - Components shared across multiple contexts
 *
 * Organization:
 * - components/layout/ = shared layout components across portals
 * - features/[portal]/layout/ = portal-specific layout components
 * - features/marketing/[page]/sections/ = marketing page sections
 */

// Dashboard Layout Components
export {
  DashboardLayout,
  Breadcrumbs,
  NavUser,
  Search,
  type DashboardLayoutProps,
  type SidebarItem,
  type SidebarSection,
} from './dashboard'

// Marketing Layout Components
export { Header, Footer } from './marketing'

// Shared Components
export { UserMenu } from './shared'
