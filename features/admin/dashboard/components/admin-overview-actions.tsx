'use client'

import { Item, ItemContent, ItemDescription, ItemSeparator, ItemTitle } from '@/components/ui/item'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AdminQuickActionsGrid } from './admin-quick-actions-grid'
import { AdminCommandSearch } from './admin-command-search'

export function AdminOverviewActions() {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Quick Actions</ItemTitle>
            <ItemDescription>
              Common administrative tasks. Press{' '}
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <span>+</span>
                <Kbd>K</Kbd>
              </KbdGroup>{' '}
              to open global search.
            </ItemDescription>
          </ItemContent>
          <ItemSeparator />
          <ItemContent>
            <AdminQuickActionsGrid />
          </ItemContent>
        </Item>

        <Item variant="outline">
          <ItemContent>
            <AdminCommandSearch />
          </ItemContent>
        </Item>
      </div>
    </TooltipProvider>
  )
}
