import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils/index'
import { DynamicBreadcrumbs } from '@/features/shared/components'

interface DashboardGridProps extends React.ComponentProps<'div'> {
  cols?: 1 | 2 | 3 | 4
}

export function DashboardGrid({ cols = 2, className, ...props }: DashboardGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        cols === 1 && 'grid-cols-1',
        cols === 2 && 'md:grid-cols-2',
        cols === 3 && 'md:grid-cols-2 lg:grid-cols-3',
        cols === 4 && 'md:grid-cols-2 lg:grid-cols-4',
        className
      )}
      {...props}
    />
  )
}

interface SidebarItem {
  title: string
  url: string
  icon?: React.ReactNode
  badge?: string | number
}

interface SidebarSection {
  title?: string
  items: SidebarItem[]
}

interface DashboardLayoutProps {
  children: React.ReactNode
  role: 'admin' | 'client'
  sidebarHeader?: React.ReactNode
  sidebarSections: SidebarSection[]
  sidebarFooter?: React.ReactNode
  breadcrumbHomeHref: string
  breadcrumbHomeLabel: string
  pageTitle?: string
  pageDescription?: string
  gridCols?: 1 | 2 | 3 | 4
}

export async function DashboardLayout({
  children,
  role,
  sidebarHeader,
  sidebarSections,
  sidebarFooter,
  breadcrumbHomeHref,
  breadcrumbHomeLabel,
  pageTitle,
  pageDescription,
  gridCols = 2,
}: DashboardLayoutProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user.id)
    .single()

  // Role-based redirects
  if (role === 'admin' && profile?.role !== 'admin') {
    redirect(ROUTES.CLIENT_DASHBOARD)
  }
  if (role === 'client' && profile?.role === 'admin') {
    redirect(ROUTES.ADMIN_DASHBOARD)
  }

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible="icon">
        {sidebarHeader && <SidebarHeader>{sidebarHeader}</SidebarHeader>}

        <SidebarContent>
          {sidebarSections.map((section, idx) => (
            <SidebarGroup key={idx}>
              {section.title && <SidebarGroupLabel>{section.title}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {sidebarFooter && <SidebarFooter>{sidebarFooter}</SidebarFooter>}
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-2 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumbs
              homeHref={breadcrumbHomeHref}
              homeLabel={breadcrumbHomeLabel}
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-2 pt-4 sm:p-4">
          {(pageTitle || pageDescription) && (
            <div className="space-y-2">
              {pageTitle && (
                <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
                  {pageTitle}
                </h1>
              )}
              {pageDescription && (
                <p className="text-muted-foreground">{pageDescription}</p>
              )}
            </div>
          )}

          <DashboardGrid cols={gridCols}>{children}</DashboardGrid>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
