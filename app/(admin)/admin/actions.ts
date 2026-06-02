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
