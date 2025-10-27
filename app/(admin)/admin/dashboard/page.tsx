import { getAdminDashboardStats, AdminOverview } from '@/features/admin/dashboard'

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats()

  return <AdminOverview stats={stats} />
}
