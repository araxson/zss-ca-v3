import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/types/database.types'

/**
 * Update Supabase session in middleware
 *
 * This function handles ONLY session token refresh for Supabase auth.
 * Per Supabase SSR documentation, this is MANDATORY for proper session management.
 *
 * What this does:
 * - Creates a Supabase client with cookie management
 * - Calls getUser() to trigger automatic token refresh if expired
 * - Updates response cookies with refreshed tokens
 *
 * What this does NOT do:
 * - Authorization checks (role verification, permissions)
 * - Database queries
 * - Route protection logic
 *
 * All authorization MUST happen in Server Components or Route Handlers!
 *
 * @see https://supabase.com/docs/guides/auth/server-side/creating-a-client
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: This triggers automatic token refresh if the session is expired
  // Supabase will automatically update cookies via the setAll callback above
  await supabase.auth.getUser()

  return supabaseResponse
}
