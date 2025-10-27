import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js 16 Proxy for Supabase Session Management
 *
 * This proxy runs on the Node.js runtime and handles session token refresh.
 * Per Next.js 16, proxy.ts replaces the deprecated middleware.ts pattern.
 *
 * IMPORTANT: This proxy should ONLY handle session token refresh.
 * Per Supabase SSR best practices, this is MANDATORY for session refreshes.
 *
 * DO NOT add authorization logic here - all auth checks belong in:
 * - Server Components (layouts, pages)
 * - Route Handlers (API routes)
 *
 * @see https://nextjs.org/blog/next-16
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export default async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - API routes, webhooks, callbacks (auth handled in route)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
