'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'

type ProfileUpdate = Partial<
  Omit<
    Database['public']['Tables']['profile']['Update'],
    'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'role'
  >
>

export async function updateProfileAction(data: ProfileUpdate) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Update profile
  const { error } = await supabase
    
    .from('profile')
    .update(data)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  // Revalidate client dashboard and profile pages
  revalidatePath(ROUTES.CLIENT_DASHBOARD, 'page')
  revalidatePath(ROUTES.CLIENT_PROFILE, 'page')
  revalidatePath(ROUTES.ADMIN_DASHBOARD, 'page')
  revalidatePath(ROUTES.ADMIN_PROFILE, 'page')

  return { success: true }
}
