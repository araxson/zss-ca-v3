import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type SupportTicket = Database['public']['Tables']['support_ticket']['Row']
type TicketReply = Database['public']['Tables']['ticket_reply']['Row']
type Profile = Database['public']['Tables']['profile']['Row']

export type TicketWithProfile = SupportTicket & {
  profile: Pick<Profile, 'id' | 'contact_email' | 'contact_name'>
}

export type ReplyWithProfile = TicketReply & {
  profile: Pick<Profile, 'id' | 'contact_email' | 'contact_name' | 'role'>
}

export type TicketWithReplies = TicketWithProfile & {
  replies: ReplyWithProfile[]
}

export async function getUserTickets(userId: string): Promise<TicketWithProfile[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('support_ticket')
    .select(
      `
      *,
      profile:profile_id(id, contact_email, contact_name)
    `
    )
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user tickets:', error)
    return []
  }

  return (data as unknown as TicketWithProfile[]) || []
}

export async function getAllTickets(): Promise<TicketWithProfile[]> {
  const supabase = await createClient()

  // Only admins can fetch all tickets - verify in the calling page
  const { data, error } = await supabase
    .from('support_ticket')
    .select(
      `
      *,
      profile:profile_id(id, contact_email, contact_name)
    `
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all tickets:', error)
    return []
  }

  return (data as unknown as TicketWithProfile[]) || []
}

export async function getTicketById(
  ticketId: string
): Promise<TicketWithReplies | null> {
  const supabase = await createClient()

  const { data: ticket, error: ticketError } = await supabase
    .from('support_ticket')
    .select(
      `
      *,
      profile:profile_id(id, contact_email, contact_name)
    `
    )
    .eq('id', ticketId)
    .single()

  if (ticketError || !ticket) {
    console.error('Error fetching ticket:', ticketError)
    return null
  }

  const { data: replies, error: repliesError } = await supabase
    .from('ticket_reply')
    .select(
      `
      *,
      profile:author_profile_id(id, contact_email, contact_name, role)
    `
    )
    .eq('support_ticket_id', ticketId)
    .order('created_at', { ascending: true })

  if (repliesError) {
    console.error('Error fetching replies:', repliesError)
  }

  return {
    ...(ticket as unknown as TicketWithProfile),
    replies: (replies as unknown as ReplyWithProfile[]) || [],
  }
}
