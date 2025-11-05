'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendSupportTicketCreatedEmail, sendSupportTicketReplyEmail } from '@/lib/email/send'
import { createTicketSchema, replyToTicketSchema } from '../schema'
import type { UpdateTicketStatusInput } from '../schema'

export async function createTicketAction(prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', fieldErrors: {} }
  }

  // Validate with Zod
  const result = createTicketSchema.safeParse({
    subject: formData.get('subject'),
    message: formData.get('message'),
    category: formData.get('category'),
    priority: formData.get('priority'),
  })

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors,
    }
  }

  const { error, data: ticket } = await supabase

    .from('support_ticket')
    .insert({
      profile_id: user.id,
      created_by_profile_id: user.id,
      subject: result.data.subject,
      message: result.data.message,
      category: result.data.category,
      priority: result.data.priority,
      status: 'open',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Ticket creation error:', error)
    return { error: 'Failed to create support ticket', fieldErrors: {} }
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
      result.data.subject
    )
  }

  // ✅ Next.js 15.1+: Use updateTag() for immediate read-your-writes consistency
  updateTag('tickets')
  updateTag(`tickets:${user.id}`)
  if (ticket) {
    updateTag(`ticket:${ticket.id}`)
  }

  revalidatePath('/client/support', 'page')
  revalidatePath('/admin/support', 'page')

  return { error: null, success: true, ticketId: ticket.id, fieldErrors: {} }
}

export async function replyToTicketAction(prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', fieldErrors: {} }
  }

  // Validate with Zod
  const result = replyToTicketSchema.safeParse({
    ticketId: formData.get('ticketId'),
    message: formData.get('message'),
  })

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors,
    }
  }

  // Verify user has access to this ticket
  const { data: ticket, error: ticketError } = await supabase
    .from('support_ticket')
    .select('profile_id, subject')
    .eq('id', result.data.ticketId)
    .single()

  if (ticketError || !ticket) {
    return { error: 'Ticket not found', fieldErrors: {} }
  }

  // Check if user is the ticket owner or admin
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (ticket.profile_id !== user.id && profile?.role !== 'admin') {
    return { error: 'Unauthorized to reply to this ticket', fieldErrors: {} }
  }

  const { error } = await supabase

    .from('ticket_reply')
    .insert({
      support_ticket_id: result.data.ticketId,
      author_profile_id: user.id,
      message: result.data.message,
    })

  if (error) {
    console.error('Ticket reply error:', error)
    return { error: 'Failed to reply to ticket', fieldErrors: {} }
  }

  // Update ticket status to in_progress if it was open
  await supabase

    .from('support_ticket')
    .update({ status: 'in_progress', last_reply_at: new Date().toISOString() })
    .eq('id', result.data.ticketId)
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
        result.data.ticketId,
        ticket.subject,
        result.data.message
      )
    }
  }

  // ✅ Next.js 15.1+: Use updateTag() for immediate read-your-writes consistency
  updateTag('tickets')
  updateTag(`tickets:${user.id}`)
  updateTag(`ticket:${result.data.ticketId}`)

  revalidatePath(`/client/support/${result.data.ticketId}`, 'page')
  revalidatePath(`/admin/support/${result.data.ticketId}`, 'page')

  return { error: null, success: true, fieldErrors: {} }
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
    updates['resolved_at'] = new Date().toISOString()
  } else if (data.status === 'closed') {
    updates['closed_at'] = new Date().toISOString()
  }

  const { error, data: updatedTicket } = await supabase

    .from('support_ticket')
    .update(updates)
    .eq('id', data.ticketId)
    .select('profile_id')
    .single()

  if (error) {
    console.error('Ticket status update error:', error)
    return { error: 'Failed to update ticket status' }
  }

  // ✅ Next.js 15.1+: Use updateTag() for immediate read-your-writes consistency
  updateTag('tickets')
  updateTag(`ticket:${data.ticketId}`)
  if (updatedTicket) {
    updateTag(`tickets:${updatedTicket.profile_id}`)
  }

  revalidatePath(`/client/support/${data.ticketId}`, 'page')
  revalidatePath(`/admin/support/${data.ticketId}`, 'page')

  return { error: null }
}
