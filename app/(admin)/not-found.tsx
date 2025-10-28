import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { ShieldAlert } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Empty className="w-full max-w-xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShieldAlert className="size-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>404 - Admin Page Not Found</EmptyTitle>
          <EmptyDescription>
            The admin page you are looking for does not exist or you do not have permission to access it.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="w-full space-y-4">
          <ButtonGroup orientation="vertical" className="w-full gap-2">
            <Button asChild className="w-full">
              <Link href={ROUTES.ADMIN_DASHBOARD}>Back to Dashboard</Link>
            </Button>
          </ButtonGroup>
          <ItemGroup className="grid w-full gap-2 sm:grid-cols-2">
            <Item asChild variant="outline" size="sm">
              <Link href={ROUTES.ADMIN_CLIENTS}>
                <ItemContent className="flex-1">
                  <ItemTitle>Clients</ItemTitle>
                </ItemContent>
              </Link>
            </Item>
            <Item asChild variant="outline" size="sm">
              <Link href={ROUTES.ADMIN_SITES}>
                <ItemContent className="flex-1">
                  <ItemTitle>Sites</ItemTitle>
                </ItemContent>
              </Link>
            </Item>
            <Item asChild variant="outline" size="sm">
              <Link href={ROUTES.ADMIN_SUPPORT}>
                <ItemContent className="flex-1">
                  <ItemTitle>Support</ItemTitle>
                </ItemContent>
              </Link>
            </Item>
            <Item asChild variant="outline" size="sm">
              <Link href={ROUTES.ADMIN_AUDIT_LOGS}>
                <ItemContent className="flex-1">
                  <ItemTitle>Audit Logs</ItemTitle>
                </ItemContent>
              </Link>
            </Item>
          </ItemGroup>
        </EmptyContent>
      </Empty>
    </div>
  )
}
