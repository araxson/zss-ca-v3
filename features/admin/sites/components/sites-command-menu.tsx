'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { ROUTES, ROUTE_HELPERS } from '@/lib/constants/routes'

interface SiteSummary {
  id: string
  name: string
  status: string
  clientName: string
}

interface SitesCommandMenuProps {
  sites: SiteSummary[]
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tagName = target.tagName.toLowerCase()
  return target.isContentEditable
    || tagName === 'input'
    || tagName === 'textarea'
    || tagName === 'select'
}

export function SitesCommandMenu({ sites }: SitesCommandMenuProps): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const siteActions = useMemo(() => (
    sites.slice(0, 8).map((site) => ({
      id: site.id,
      label: site.name,
      description: site.clientName,
      status: site.status,
    }))
  ), [sites])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableElement(event.target)) {
        return
      }

      const key = event.key.toLowerCase()
      const hasModifier = event.metaKey || event.ctrlKey

      if (hasModifier && key === 'k') {
        event.preventDefault()
        setOpen((previous) => !previous)
      }

      if (hasModifier && key === 'c') {
        event.preventDefault()
        router.push(ROUTES.ADMIN_SITES_NEW)
      }

      if ((event.shiftKey && event.key === '?') || (event.shiftKey && key === '/')) {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search sites or actions..." />
      <CommandList>
        <CommandEmpty>No matches found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem
            value="create-site"
            onSelect={() => {
              setOpen(false)
              router.push(ROUTES.ADMIN_SITES_NEW)
            }}
          >
            Create new site
            <span className="ml-auto text-xs text-muted-foreground">⌘ + C</span>
          </CommandItem>
          <CommandItem
            value="view-all-sites"
            onSelect={() => {
              setOpen(false)
              router.push(ROUTES.ADMIN_SITES)
            }}
          >
            View all sites
            <span className="ml-auto text-xs text-muted-foreground">⌘ + K</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Keyboard shortcuts">
          <CommandItem onSelect={() => setOpen(true)}>
            Toggle command palette
            <span className="ml-auto text-xs text-muted-foreground">⌘ + K</span>
          </CommandItem>
          <CommandItem onSelect={() => setOpen(true)}>
            Create new site
            <span className="ml-auto text-xs text-muted-foreground">⌘ + C</span>
          </CommandItem>
          <CommandItem onSelect={() => setOpen(true)}>
            Show this panel
            <span className="ml-auto text-xs text-muted-foreground">Shift + ?</span>
          </CommandItem>
        </CommandGroup>

        {siteActions.length > 0 ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent sites">
              {siteActions.map((site) => (
                <CommandItem
                  key={site.id}
                  value={site.id}
                  onSelect={() => {
                    setOpen(false)
                    router.push(ROUTE_HELPERS.adminSiteDetail(site.id))
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{site.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {site.description || 'Unassigned'} • {site.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </CommandDialog>
  )
}
