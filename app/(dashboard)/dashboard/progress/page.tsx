import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Session, SessionSubmission, Feedback } from '@/types'
import ProgressClient from '@/components/dashboard/ProgressClient'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('product').eq('id', user.id).single()
  if (profile?.product === 'fastrack') redirect('/dashboard')

  const [{ data: sessions }, { data: subs }, { data: feedbacks }] = await Promise.all([
    supabase.from('sessions').select('*').eq('user_id', user.id).order('session_number', { ascending: true }),
    supabase.from('session_submissions').select('*').eq('user_id', user.id),
    supabase.from('feedbacks').select('*').eq('user_id', user.id).order('session_number', { ascending: true }),
  ])

  const subsMap: Record<string, SessionSubmission> = {}
  subs?.forEach(s => { subsMap[s.session_id] = s as SessionSubmission })

  const feedbacksBySession: Record<number, Feedback[]> = {}
  feedbacks?.forEach(f => {
    const n = f.session_number ?? 0
    if (!feedbacksBySession[n]) feedbacksBySession[n] = []
    feedbacksBySession[n].push(f as Feedback)
  })

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Progress Bimbingan</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Catatan, PR, dan submission setiap sesi bimbinganmu.</p>
      </div>
      <ProgressClient
        sessions={(sessions ?? []) as Session[]}
        subsMap={subsMap}
        feedbacksBySession={feedbacksBySession}
        userId={user.id}
      />
    </div>
  )
}
