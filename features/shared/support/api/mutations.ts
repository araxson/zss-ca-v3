'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendSupportTicketCreatedEmail, sendSupportTicketReplyEmail } from '@/lib/email/send'
import type { CreateTicketInput, ReplyToTicketInput, UpdateTicketStatusInput } from '../schema'

export async function createTicketAction(data: CreateTicketInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error, data: ticket } = await supabase
    .from('support_ticket')
    .insert({
      profile_id: user.id,
      created_by_profile_id: user.id,
      subject: data.subject,
      message: data.message,
      category: data.category,
      priority: data.priority,
      status: 'open',
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message }
  }

  // Send ticket created email
  const { data: profile } = await supabase
    .from('profile')
    .select('contact_email, contact_name')
    .eq('id', user.id)
    .single()

  if (profile?.contact_email && profile?.contact_name && ticket) {
    await sendSupportTicketCreatedEmail(
      profile.contact_email,
      profile.contact_name,
      ticket.id,
      data.subject
    )
  }

  revalidatePath('/client/support', 'page')
  revalidatePath('/admin/support', 'page')

  return { success: true }
}

export async function replyToTicketAction(data: ReplyToTicketInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify user has access to this ticket
  const { data: ticket, error: ticketError } = await supabase
    .from('support_ticket')
    .select('profile_id, subject')
    .eq('id', data.ticketId)
    .single()

  if (ticketError || !ticket) {
    return { error: 'Ticket not found' }
  }

  // Check if user is the ticket owner or admin
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (ticket.profile_id !== user.id && profile?.role !== 'admin') {
    return { error: 'Unauthorized to reply to this ticket' }
  }

  const { error } = await supabase.from('ticket_reply').insert({
    support_ticket_id: data.ticketId,
    author_profile_id: user.id,
    message: data.message,
  })

  if (error) {
    return { error: error.message }
  }

  // Update ticket status to in_progress if it was open
  await supabase
    .from('support_ticket')
    .update({ status: 'in_progress', last_reply_at: new Date().toISOString() })
    .eq('id', data.ticketId)
    .eq('status', 'open')

  // Send reply email to ticket owner if reply is from admin
  if (profile?.role === 'admin' && ticket.profile_id !== user.id) {
    const { data: ticketOwner } = await supabase
      .from('profile')
      .select('contact_email, contact_name')
      .eq('id', ticket.profile_id)
      .single()

    if (ticketOwner?.contact_email && ticketOwner?.contact_name) {
      await sendSupportTicketReplyEmail(
        ticketOwner.contact_email,
        ticketOwner.contact_name,
        data.ticketId,
        ticket.subject,
        data.message
      )
    }
  }

  revalidatePath(`/client/support/${data.ticketId}`, 'page')
  revalidatePath(`/admin/support/${data.ticketId}`, 'page')
  revalidatePath('/client/support', 'page')
  revalidatePath('/admin/support', 'page')

  return { success: true }
}

export async function updateTicketStatusAction(data: UpdateTicketStatusInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Only admins can update ticket status
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Only admins can update ticket status' }
  }

  const updates: Record<string, unknown> = {
    status: data.status,
  }

  if (data.status === 'resolved') {
    updates.resolved_at = new Date().toISOString()
  } else if (data.status === 'closed') {
    updates.closed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('support_ticket')
    .update(updates)
    .eq('id', data.ticketId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/client/support/${data.ticketId}`, 'page')
  revalidatePath(`/admin/support/${data.ticketId}`, 'page')
  revalidatePath('/client/support', 'page')
  revalidatePath('/admin/support', 'page')

  return { success: true }
}
