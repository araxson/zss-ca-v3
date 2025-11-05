import { Skeleton } from '@/components/ui/skeleton'

export default function VerifyOtpLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-9 w-48" />
          <Skeleton className="mx-auto h-5 w-64" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
