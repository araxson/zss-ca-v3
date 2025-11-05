import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { ROUTES } from '@/lib/constants'

// ✅ Next.js 15+: Route Handler GET must explicitly set dynamic
// This is a callback endpoint that should never be cached
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    // Get user and profile in parallel
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Parallel query for profile
      const { data: profile } = await supabase
        .from('profile')
        .select('role')
        .eq('id', user.id)
        .single()

      // ✅ CRITICAL: Clear all cached data after OAuth login
      // This ensures fresh user-specific data is loaded
      revalidatePath('/', 'layout')

      // Redirect based on user role
      const redirectUrl = profile?.role === 'admin'
        ? ROUTES.ADMIN_DASHBOARD
        : ROUTES.CLIENT_DASHBOARD

      return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin))
    }
  }

  // Fallback to login if no code or user
  return NextResponse.redirect(new URL(ROUTES.LOGIN, requestUrl.origin))
}
