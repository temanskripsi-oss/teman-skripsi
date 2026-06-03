import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import ClientDetail from '@/components/admin/ClientDetail'
import type { Profile, Session, Feedback, TaskSubmission, SessionSubmission } from '@/types'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data: profileData } = await supabase.from('profiles').select('product').eq('id', id).single()

  const [{ data: profile }, { data: sessions }, { data: videos }, { data: progress }, { data: userData }, { data: feedbacks }, { data: submissions }, { data: sessionSubs }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).single(),
    supabase.from('sessions').select('*').eq('user_id', id).order('session_number', { ascending: true }),
    supabase.from('videos').select('id').or(`product.eq.all,product.eq.${profileData?.product}`),
    supabase.from('video_progress').select('id').eq('user_id', id),
    supabase.auth.admin.getUserById(id),
    supabase.from('feedbacks').select('*').eq('user_id', id).order('created_at', { ascending: false }),
    supabase.from('task_submissions').select('*, task:tasks(id, title, week_number)').eq('user_id', id).order('submitted_at', { ascending: false }),
    supabase.from('session_submissions').select('*').eq('user_id', id),
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
        <div className="flex items-center gap-4">
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt={profile.full_name} width={56} height={56}
              className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border border-gray-100 shadow-sm" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {profile.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-[#1E1B4B]">{profile.full_name}</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">{profile.university} · {profile.phone}</p>
          </div>
        </div>
      </div>
      <ClientDetail
        profile={profile as Profile}
        sessions={(sessions ?? []) as Session[]}
        feedbacks={(feedbacks ?? []) as Feedback[]}
        submissions={(submissions ?? []) as TaskSubmission[]}
        sessionSubmissions={(sessionSubs ?? []) as SessionSubmission[]}
        mentors={(mentors ?? []) as { id: string; full_name: string }[]}
        videoProgress={{ total: videos?.length ?? 0, watched: progress?.length ?? 0 }}
        email={userData?.user?.email ?? ''}
      />
    </div>
  )
}
