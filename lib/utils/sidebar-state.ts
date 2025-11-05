import 'server-only'
import { cookies } from 'next/headers'

const SIDEBAR_STATE_COOKIE = 'sidebar_state'
const DEFAULT_STATE = false

/**
 * Get the sidebar open/closed state from cookies
 *
 * @returns True if sidebar is open, false if closed
 */
export async function getSidebarState(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const state = cookieStore.get(SIDEBAR_STATE_COOKIE)?.value
    return state === 'true'
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to read sidebar state:', error.message)
    } else {
      console.error('Failed to read sidebar state:', String(error))
    }
    return DEFAULT_STATE
  }
}

/**
 * Set the sidebar open/closed state in cookies
 *
 * @param open - True to set sidebar as open, false for closed
 */
export async function setSidebarState(open: boolean): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.set(SIDEBAR_STATE_COOKIE, String(open), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      sameSite: 'lax',
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to set sidebar state:', error.message)
    } else {
      console.error('Failed to set sidebar state:', String(error))
    }
  }
}
