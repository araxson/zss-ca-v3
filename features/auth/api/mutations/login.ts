'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import type { LoginInput } from '../../schema'

export async function loginAction(data: LoginInput) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: error.message }
  }

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

    redirect(redirectUrl)
  }

  redirect(ROUTES.CLIENT_DASHBOARD)
}
