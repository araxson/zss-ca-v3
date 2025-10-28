import { getAllTickets } from '@/features/shared/support/api/queries'
import { AdminSupportDashboard } from '@/features/admin/support'

export default async function AdminSupportPage() {
  const tickets = await getAllTickets()

  return <AdminSupportDashboard tickets={tickets} />
}
