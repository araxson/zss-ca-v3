import { getClientById } from '@/features/admin/clients/api/queries'
import { ClientDetailView } from '@/features/admin/clients/components/client-detail-view'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminClientDetailPage({ params }: PageProps) {
  const { id } = await params
  const client = await getClientById(id)

  return <ClientDetailView client={client} />
}
