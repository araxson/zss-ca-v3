import { getClientById, ClientDetailView } from '@/features/admin/clients'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminClientDetailPage({ params }: PageProps) {
  const { id } = await params
  const client = await getClientById(id)

  return <ClientDetailView client={client} />
}
