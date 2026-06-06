'use server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'

export async function createClientAction(data: {
  email: string
  full_name: string
  university: string
  phone: string
  product: string
  active_until: string
  mentor_id?: string | null
  start_date?: string | null
}) {
  const supabase = createServiceClient()
  const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
    email: data.email,
    password: Math.random().toString(36).slice(-8) + 'A1!',
    email_confirm: true,
  })
  if (authError || !user) return { error: authError?.message || 'Gagal membuat akun' }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: data.full_name,
    university: data.university,
    phone: data.phone,
    product: data.product,
    active_until: data.active_until,
    role: 'user',
    mentor_id: data.mentor_id ?? null,
    start_date: data.mentor_id ? (data.start_date ?? new Date().toISOString().split('T')[0]) : null,
  })
  if (error) {
    await supabase.auth.admin.deleteUser(user.id)
    return { error: error.message }
  }

  revalidatePath('/admin/clients')
  revalidatePath('/admin')
  return { success: true, userId: user.id }
}

export async function updateClientAction(userId: string, data: {
  full_name: string
  university: string
  phone: string
  product: string
  active_until: string
  mentor_id?: string | null
  start_date?: string | null
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('profiles').update(data).eq('id', userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/clients')
  revalidatePath(`/admin/clients/${userId}`)
  revalidatePath('/admin')
  return { success: true }
}

export async function sendPasswordResetAction(email: string) {
  const supabase = createServiceClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teman-skripsi-delta.vercel.app'
  const { error } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo: `${siteUrl}/auth/callback?type=recovery` },
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function createSessionAction(data: {
  user_id: string
  session_number: number
  session_type: 'online' | 'offline'
  scheduled_at: string
  zoom_link: string
  notes: string
  status: 'upcoming' | 'done'
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('sessions').insert(data)
  if (error) return { error: error.message }
  revalidatePath(`/admin/clients/${data.user_id}`)
  revalidatePath('/admin')
  return { success: true }
}

export async function updateSessionAction(sessionId: string, userId: string, data: {
  session_number: number
  session_type: 'online' | 'offline'
  scheduled_at: string
  zoom_link: string
  notes: string
  status: 'upcoming' | 'done'
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('sessions').update(data).eq('id', sessionId)
  if (error) return { error: error.message }
  revalidatePath(`/admin/clients/${userId}`)
  return { success: true }
}

export async function deleteSessionAction(sessionId: string, userId: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('sessions').delete().eq('id', sessionId)
  if (error) return { error: error.message }
  revalidatePath(`/admin/clients/${userId}`)
  return { success: true }
}

export async function createVideoAction(data: {
  title: string
  description: string
  youtube_url: string
  week_number: number
  order_index: number
  product: string
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('videos').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/content')
  return { success: true }
}

export async function updateVideoAction(videoId: string, data: {
  title: string
  description: string
  youtube_url: string
  week_number: number
  order_index: number
  product: string
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('videos').update(data).eq('id', videoId)
  if (error) return { error: error.message }
  revalidatePath('/admin/content')
  return { success: true }
}

export async function deleteVideoAction(videoId: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('videos').delete().eq('id', videoId)
  if (error) return { error: error.message }
  revalidatePath('/admin/content')
  return { success: true }
}

export async function createFreebieAction(data: {
  title: string
  description: string
  file_url: string
  product: string
  order_index: number
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('freebies').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/content')
  return { success: true }
}

export async function updateFreebieAction(freebieId: string, data: {
  title: string
  description: string
  file_url: string
  product: string
  order_index: number
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('freebies').update(data).eq('id', freebieId)
  if (error) return { error: error.message }
  revalidatePath('/admin/content')
  return { success: true }
}

export async function deleteFreebieAction(freebieId: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('freebies').delete().eq('id', freebieId)
  if (error) return { error: error.message }
  revalidatePath('/admin/content')
  return { success: true }
}

export async function createPaymentAction(data: {
  user_id: string
  amount: number
  description: string
  payment_date: string
  status: 'paid' | 'pending'
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('payments').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/revenue')
  revalidatePath('/admin')
  return { success: true }
}

export async function updatePaymentStatusAction(paymentId: string, status: 'paid' | 'pending') {
  const supabase = createServiceClient()
  const { error } = await supabase.from('payments').update({ status }).eq('id', paymentId)
  if (error) return { error: error.message }
  revalidatePath('/admin/revenue')
  revalidatePath('/admin')
  return { success: true }
}

export async function deletePaymentAction(paymentId: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('payments').delete().eq('id', paymentId)
  if (error) return { error: error.message }
  revalidatePath('/admin/revenue')
  revalidatePath('/admin')
  return { success: true }
}

export async function createMentorAction(data: {
  email: string
  full_name: string
  phone: string
}) {
  const supabase = createServiceClient()
  const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
    email: data.email,
    password: Math.random().toString(36).slice(-8) + 'A1!',
    email_confirm: true,
  })
  if (authError || !user) return { error: authError?.message || 'Gagal membuat akun mentor' }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: data.full_name,
    phone: data.phone,
    role: 'mentor',
    university: '',
    product: 'fastrack',
    active_until: '2099-12-31',
  })
  if (error) {
    await supabase.auth.admin.deleteUser(user.id)
    return { error: error.message }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teman-skripsi-delta.vercel.app'
  await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: data.email,
    options: { redirectTo: `${siteUrl}/auth/callback?type=recovery` },
  })

  revalidatePath('/admin/mentors')
  return { success: true, userId: user.id }
}

export async function deleteGhostAccountAction(userId: string) {
  const supabase = createServiceClient()
  await supabase.from('profiles').delete().eq('id', userId)
  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/clients')
  return { success: true }
}

export async function deleteClientAction(userId: string) {
  const supabase = createServiceClient()
  await supabase.from('profiles').delete().eq('id', userId)
  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/clients')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteMentorAction(mentorId: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.auth.admin.deleteUser(mentorId)
  if (error) return { error: error.message }
  revalidatePath('/admin/mentors')
  return { success: true }
}

export async function upsertWeekTitleAction(weekNumber: number, product: string, title: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('week_configs').upsert(
    { week_number: weekNumber, product, title },
    { onConflict: 'week_number,product' }
  )
  if (error) return { error: error.message }
  revalidatePath('/admin/content')
  revalidatePath('/dashboard/tasks')
  return { success: true }
}

export async function createTaskAction(data: {
  week_number: number
  title: string
  description: string
  product: string
  order_index: number
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('tasks').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/content')
  return { success: true }
}

export async function updateTaskAction(taskId: string, data: {
  week_number: number
  title: string
  description: string
  product: string
  order_index: number
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('tasks').update(data).eq('id', taskId)
  if (error) return { error: error.message }
  revalidatePath('/admin/content')
  return { success: true }
}

export async function deleteTaskAction(taskId: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  if (error) return { error: error.message }
  revalidatePath('/admin/content')
  return { success: true }
}

export async function reviewSubmissionAction(submissionId: string, clientId: string, data: {
  status: 'reviewed' | 'revision'
  mentor_feedback: string
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('task_submissions').update({
    ...data,
    reviewed_at: new Date().toISOString(),
  }).eq('id', submissionId)
  if (error) return { error: error.message }
  revalidatePath(`/admin/clients/${clientId}`)
  return { success: true }
}

export async function createFeedbackAction(data: {
  user_id: string
  title: string
  description: string
  type: 'pdf' | 'video'
  url: string
  session_number: number | null
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('feedbacks').insert(data)
  if (error) return { error: error.message }
  revalidatePath(`/admin/clients/${data.user_id}`)
  return { success: true }
}

export async function updateFeedbackAction(feedbackId: string, userId: string, data: {
  title: string
  description: string
  type: 'pdf' | 'video'
  url: string
  session_number: number | null
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('feedbacks').update(data).eq('id', feedbackId)
  if (error) return { error: error.message }
  revalidatePath(`/admin/clients/${userId}`)
  return { success: true }
}

export async function deleteFeedbackAction(feedbackId: string, userId: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('feedbacks').delete().eq('id', feedbackId)
  if (error) return { error: error.message }
  revalidatePath(`/admin/clients/${userId}`)
  return { success: true }
}

export async function updateSessionProgressAction(sessionId: string, userId: string, data: {
  catatan_sesi: string
  pr_description: string
  session_file_url: string
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('sessions').update(data).eq('id', sessionId)
  if (error) return { error: error.message }
  revalidatePath(`/admin/clients/${userId}`)
  revalidatePath(`/mentor/clients/${userId}`)
  return { success: true }
}

export async function reviewSessionSubmissionAction(submissionId: string, userId: string, data: {
  status: 'disetujui' | 'revisi'
  mentor_feedback: string
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('session_submissions').update({
    ...data,
    reviewed_at: new Date().toISOString(),
  }).eq('id', submissionId)
  if (error) return { error: error.message }
  revalidatePath(`/admin/clients/${userId}`)
  revalidatePath(`/mentor/clients/${userId}`)
  revalidatePath('/dashboard/progress')
  return { success: true }
}
