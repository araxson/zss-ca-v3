import 'server-only'

interface PageHeaderProps {
  pageTitle?: string
  pageDescription?: string
  pageActions?: React.ReactNode
}

export function PageHeader({ pageTitle, pageDescription, pageActions }: PageHeaderProps) {
  if (!pageTitle && !pageDescription && !pageActions) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="space-y-1">
        {pageTitle && <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>}
        {pageDescription && <p className="text-sm text-muted-foreground">{pageDescription}</p>}
      </div>
      {pageActions && (
        <div className="flex items-center gap-2 sm:shrink-0">{pageActions}</div>
      )}
    </div>
  )
}
