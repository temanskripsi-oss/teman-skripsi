import { createServiceClient } from '@/lib/supabase/service'
import RekapClient from '@/components/admin/RekapClient'

export default async function RekapPage() {
  const supabase = createServiceClient()

  const [
    { data: clients },
    { data: mentors },
    { data: sessions },
    { data: sessionSubmissions },
    { data: taskSubmissions },
    { data: payments },
    { data: videosList },
    { data: videoProgress },
  ] = await Promise.all([
    supabase.from('profiles').select('id, full_name, product, start_date, active_until, created_at, mentor_id, avatar_url, university').eq('role', 'user'),
    supabase.from('profiles').select('id, full_name').eq('role', 'mentor'),
    supabase.from('sessions').select('id, user_id, status, session_type, scheduled_at, session_number'),
    supabase.from('session_submissions').select('id, user_id, session_id, status'),
    supabase.from('task_submissions').select('id, user_id, status'),
    supabase.from('payments').select('user_id, amount, status, payment_date'),
    supabase.from('videos').select('id, product'),
    supabase.from('video_progress').select('user_id, video_id'),
  ])

  return (
    <RekapClient
      clients={clients ?? []}
      mentors={mentors ?? []}
      sessions={sessions ?? []}
      sessionSubmissions={sessionSubmissions ?? []}
      taskSubmissions={taskSubmissions ?? []}
      payments={payments ?? []}
      videos={videosList ?? []}
      videoProgress={videoProgress ?? []}
    />
  )
}
