import { getAllTickets } from '@/features/shared/support/api/queries'
import { AdminSupportDashboard } from '@/features/admin/support/components/admin-support-dashboard'

export default async function AdminSupportPage() {
  const tickets = await getAllTickets()

  return <AdminSupportDashboard tickets={tickets} />
}
