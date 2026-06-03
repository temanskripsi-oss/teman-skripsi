import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ClientDetail from '@/components/admin/ClientDetail'
import type { Profile, Session, Feedback, TaskSubmission } from '@/types'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data: profileData } = await supabase.from('profiles').select('product').eq('id', id).single()

  const [{ data: profile }, { data: sessions }, { data: videos }, { data: progress }, { data: userData }, { data: feedbacks }, { data: submissions }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).single(),
    supabase.from('sessions').select('*').eq('user_id', id).order('session_number', { ascending: true }),
    supabase.from('videos').select('id').or(`product.eq.all,product.eq.${profileData?.product}`),
    supabase.from('video_progress').select('id').eq('user_id', id),
    supabase.auth.admin.getUserById(id),
    supabase.from('feedbacks').select('*').eq('user_id', id).order('created_at', { ascending: false }),
    supabase.from('task_submissions').select('*, task:tasks(id, title, week_number)').eq('user_id', id).order('submitted_at', { ascending: false }),
  ])

  const { data: mentors } = await supabase
    .from('profiles').select('id, full_name').eq('role', 'mentor').order('full_name', { ascending: true })

  if (!profile) notFound()

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/admin/clients" className="inline-flex items-center gap-2 text-[#9CA3AF] text-sm hover:text-[#1E1B4B] transition-colors mb-4 cursor-pointer">
          <ArrowLeft size={14} /> Kembali ke Klien
        </Link>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">{profile.full_name}</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">{profile.university} · {profile.phone}</p>
      </div>
      <ClientDetail
        profile={profile as Profile}
        sessions={(sessions ?? []) as Session[]}
        feedbacks={(feedbacks ?? []) as Feedback[]}
        submissions={(submissions ?? []) as TaskSubmission[]}
        mentors={(mentors ?? []) as { id: string; full_name: string }[]}
        videoProgress={{ total: videos?.length ?? 0, watched: progress?.length ?? 0 }}
        email={userData?.user?.email ?? ''}
      />
    </div>
  )
}
