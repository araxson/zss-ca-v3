'use client'

import { useRouter } from 'next/navigation'
import { Globe, Plus, Users as UsersIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ROUTES } from '@/lib/constants/routes'

export function AdminQuickActionsGrid() {
  const router = useRouter()

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => router.push(ROUTES.ADMIN_CLIENTS)}
            className="h-auto flex-col items-start gap-2 p-4"
          >
            <UsersIcon className="size-5" aria-hidden="true" />
            <div className="text-left">
              <div className="font-semibold">Manage Clients</div>
              <div className="text-xs font-normal text-muted-foreground">
                View and edit client accounts
              </div>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Access client management dashboard</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.ADMIN_SITES)}
            className="h-auto flex-col items-start gap-2 p-4"
          >
            <Globe className="size-5" aria-hidden="true" />
            <div className="text-left">
              <div className="font-semibold">View Sites</div>
              <div className="text-xs font-normal text-muted-foreground">
                Browse all deployments
              </div>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View all client website deployments</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.ADMIN_SITES_NEW)}
            className="h-auto flex-col items-start gap-2 p-4"
          >
            <Plus className="size-5" aria-hidden="true" />
            <div className="text-left">
              <div className="font-semibold">New Site</div>
              <div className="text-xs font-normal text-muted-foreground">
                Create a client website
              </div>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Launch new site setup wizard</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
