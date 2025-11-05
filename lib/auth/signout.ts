'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'

export async function signoutAction(): Promise<never> {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // ✅ CRITICAL: Clear all cached data after signout
  // This ensures no user-specific data persists in cache
  revalidatePath('/', 'layout')

  redirect(ROUTES.LOGIN)
}
