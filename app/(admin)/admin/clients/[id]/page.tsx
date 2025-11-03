import { ClientDetailPageFeature } from '@/features/admin/clients/[id]'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminClientDetailPage({ params }: PageProps) {
  const { id } = await params
  return <ClientDetailPageFeature clientId={id} />
}
