/**
 * Dashboard Layout Components
 *
 * Shared dashboard layout components used by both admin and client portals.
 * All components are organized for optimal file size and maintainability.
 */

// Main Layout
export { DashboardLayout, type DashboardLayoutProps } from './layout'

// Sidebar Components
export { SidebarNav, type SidebarItem, type SidebarSection } from './sidebar-nav'
export { NavUser } from './nav-user'
export { NavUserAvatar } from './nav-user-avatar'
export { NavUserMenuItems } from './nav-user-menu-items'

// Header Components
export { Breadcrumbs } from './breadcrumbs'
export { Search } from './search'
export { PageHeader } from './page-header'
