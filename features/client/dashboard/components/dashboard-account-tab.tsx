'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import type { Database } from '@/lib/types/database.types'
import { ROUTES } from '@/lib/constants/routes'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { SectionHeader } from '@/features/shared/components'
import { Bell, CreditCard, Globe, LifeBuoy } from 'lucide-react'

type Profile = Database['public']['Tables']['profile']['Row'] | null

interface DashboardAccountTabProps {
  profile: Profile
  onNavigate: (path: string) => void
}

export function DashboardAccountTab({ profile, onNavigate }: DashboardAccountTabProps) {
  return (
    <ItemGroup>
      <SectionHeader
        title="Account overview"
        description="Review your profile and jump to frequently used tools."
        align="start"
      />
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>Account Information</ItemTitle>
          <ItemDescription>Your profile details</ItemDescription>
        </ItemHeader>
        <ItemContent>
          <FieldGroup>
            <Field orientation="responsive">
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <FieldTitle>{profile?.contact_name ?? '—'}</FieldTitle>
                {!profile?.contact_name ? (
                  <FieldDescription>Add your name so our team knows who to contact.</FieldDescription>
                ) : null}
              </FieldContent>
            </Field>
            <Field orientation="responsive">
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <FieldTitle>{profile?.contact_email ?? '—'}</FieldTitle>
                {!profile?.contact_email ? (
                  <FieldDescription>Keep your email up to date for important notifications.</FieldDescription>
                ) : null}
              </FieldContent>
            </Field>
            <Field orientation="responsive">
              <FieldLabel>Company</FieldLabel>
              <FieldContent>
                <FieldTitle>{profile?.company_name ?? '—'}</FieldTitle>
              </FieldContent>
            </Field>
            <Field orientation="responsive">
              <FieldLabel>Phone</FieldLabel>
              <FieldContent>
                <FieldTitle>{profile?.contact_phone ?? '—'}</FieldTitle>
                {!profile?.contact_phone ? (
                  <FieldDescription>Adding a phone number helps with urgent updates.</FieldDescription>
                ) : null}
              </FieldContent>
            </Field>
          </FieldGroup>
        </ItemContent>
        <ItemFooter>
          <Button asChild variant="outline">
            <Link href={ROUTES.CLIENT_PROFILE}>Edit Profile</Link>
          </Button>
        </ItemFooter>
      </Item>

      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Quick Actions</ItemTitle>
          <ItemDescription>
            Common tasks. Press{' '}
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <span>+</span>
              <Kbd>K</Kbd>
            </KbdGroup>{' '}
            to open global navigation.
          </ItemDescription>
        </ItemContent>
        <ItemContent>
          <Command aria-label="Client quick navigation">
            <CommandList>
              <CommandGroup heading="Account">
                <CommandItem
                  value="client-sites"
                  onSelect={() => onNavigate(ROUTES.CLIENT_SITES)}
                >
                  <Globe className="mr-2 size-4" />
                  <span>My Websites</span>
                </CommandItem>
                <CommandItem
                  value="client-subscription"
                  onSelect={() => onNavigate(ROUTES.CLIENT_SUBSCRIPTION)}
                >
                  <CreditCard className="mr-2 size-4" />
                  <span>Subscription</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Support">
                <CommandItem
                  value="client-support"
                  onSelect={() => onNavigate(ROUTES.CLIENT_SUPPORT)}
                >
                  <LifeBuoy className="mr-2 size-4" />
                  <span>Support</span>
                </CommandItem>
                <CommandItem
                  value="client-notifications"
                  onSelect={() => onNavigate(ROUTES.CLIENT_NOTIFICATIONS)}
                >
                  <Bell className="mr-2 size-4" />
                  <span>Notifications</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </ItemContent>
        <ItemSeparator />
        <ItemContent>
          <ButtonGroup aria-label="Account shortcuts">
            <Button variant="outline" onClick={() => onNavigate(ROUTES.CLIENT_SUBSCRIPTION)}>
              Subscription
            </Button>
            <Button variant="outline" onClick={() => onNavigate(ROUTES.CLIENT_SUPPORT)}>
              Support
            </Button>
          </ButtonGroup>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
