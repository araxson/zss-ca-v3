import { getAdminDashboardStats } from './api'
import { AdminOverview } from './components/admin-overview'

export async function AdminDashboardFeature() {
  const stats = await getAdminDashboardStats()

  return <AdminOverview stats={stats} />
}
