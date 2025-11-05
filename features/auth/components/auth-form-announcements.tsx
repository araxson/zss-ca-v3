'use client'

interface AuthFormAnnouncementsProps {
  messages: Array<string | null | undefined | false>
}

export function AuthFormAnnouncements({
  messages,
}: AuthFormAnnouncementsProps): React.JSX.Element {
  const text = messages.filter(Boolean).join('. ')

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {text}
    </div>
  )
}
