import { ROUTES } from '@/lib/constants/routes'

export const navConfig = {
  marketing: [
    {
      title: 'Features',
      href: `${ROUTES.HOME}#features`,
    },
    {
      title: 'Pricing',
      href: ROUTES.PRICING,
    },
    {
      title: 'About',
      href: ROUTES.ABOUT,
    },
    {
      title: 'Contact',
      href: ROUTES.CONTACT,
    },
  ],
  client: [
    {
      title: 'Dashboard',
      href: ROUTES.CLIENT_DASHBOARD,
    },
    {
      title: 'My Sites',
      href: ROUTES.CLIENT_SITES,
    },
    {
      title: 'Support',
      href: ROUTES.CLIENT_SUPPORT,
    },
    {
      title: 'Subscription',
      href: ROUTES.CLIENT_SUBSCRIPTION,
    },
  ],
  admin: [
    {
      title: 'Dashboard',
      href: ROUTES.ADMIN_DASHBOARD,
    },
    {
      title: 'Clients',
      href: ROUTES.ADMIN_CLIENTS,
    },
    {
      title: 'Sites',
      href: ROUTES.ADMIN_SITES,
    },
    {
      title: 'Support Tickets',
      href: ROUTES.ADMIN_SUPPORT,
    },
    {
      title: 'Notifications',
      href: ROUTES.ADMIN_NOTIFICATIONS,
    },
    {
      title: 'Audit Logs',
      href: ROUTES.ADMIN_AUDIT_LOGS,
    },
  ],
} as const
