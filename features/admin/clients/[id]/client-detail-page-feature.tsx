import { Suspense } from 'react'
import { getClientById } from './api/queries'
import { ClientDetailView } from './components'

interface ClientDetailPageFeatureProps {
  clientId: string
}

export async function ClientDetailPageFeature({ clientId }: ClientDetailPageFeatureProps) {
  const client = await getClientById(clientId)

  return (
    <Suspense fallback={null}>
      <ClientDetailView client={client} />
    </Suspense>
  )
}
