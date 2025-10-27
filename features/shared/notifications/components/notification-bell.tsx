'use client'

import { Bell } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface NotificationBellProps {
  unreadCount: number
  href: string
}

export function NotificationBell({ unreadCount, href }: NotificationBellProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href={href} aria-label={`View notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {unreadCount > 0
            ? `You have ${unreadCount > 9 ? '9+' : unreadCount} unread notifications`
            : 'You are all caught up'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
