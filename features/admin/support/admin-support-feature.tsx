import { listTickets } from './api/queries'
import { SupportPageFeature } from './components'

export async function AdminSupportFeature() {
  const tickets = await listTickets()

  return <SupportPageFeature tickets={tickets} />
}
