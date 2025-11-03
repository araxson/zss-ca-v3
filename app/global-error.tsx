'use client'

import { GlobalErrorBoundary } from '@/features/shared/error-boundaries'

export default function GlobalError(props: Parameters<typeof GlobalErrorBoundary>[0]) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <GlobalErrorBoundary {...props} />
      </body>
    </html>
  )
}
