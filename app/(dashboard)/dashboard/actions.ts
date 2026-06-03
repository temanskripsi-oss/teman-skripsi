'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitTaskAction(taskId: string, data: { url: string; notes: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('task_submissions').upsert(
    { task_id: taskId, user_id: user.id, ...data, submitted_at: new Date().toISOString(), status: 'submitted' },
    { onConflict: 'task_id,user_id' }
  )
  if (error) return { error: error.message }
  revalidatePath('/dashboard/tasks')
  return { success: true }
}

export async function submitSessionAction(sessionId: string, data: { url: string; notes: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('session_submissions').upsert(
    { session_id: sessionId, user_id: user.id, ...data, submitted_at: new Date().toISOString(), status: 'submitted' },
    { onConflict: 'session_id,user_id' }
  )
  if (error) return { error: error.message }
  revalidatePath('/dashboard/progress')
  return { success: true }
}

export async function markVideoWatchedAction(videoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  await supabase.from('video_progress').upsert(
    { user_id: user.id, video_id: videoId },
    { onConflict: 'user_id,video_id' }
  )
  revalidatePath('/dashboard/videos')
  revalidatePath('/dashboard')
  return { success: true }
}
