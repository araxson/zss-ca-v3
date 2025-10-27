import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    // Get user profile to determine role
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('profile')
        .select('role')
        .eq('id', user.id)
        .single()

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
