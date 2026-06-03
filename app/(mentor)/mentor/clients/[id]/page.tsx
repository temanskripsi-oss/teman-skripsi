import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Video, MapPin, CheckCircle, Clock, ExternalLink, ClipboardList, RotateCcw } from 'lucide-react'
import MentorReviewClient from '@/components/mentor/MentorReviewClient'
import type { Profile, Session, TaskSubmission, Feedback } from '@/types'

const PRODUCT_LABELS: Record<string, string> = {
  fastrack:               'Fastrack · 1 bulan',
  'mentoring-sempro':     'Mentoring Sempro · 3 bulan · 9 sesi',
  'mentoring-penelitian': 'Mentoring Penelitian · 3 bulan · 9 sesi',
  all:                    'All Access',
}

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Dikumpulkan', color: '#2232dd', bg: '#eff6ff' },
  reviewed:  { label: 'Disetujui',   color: '#16a34a', bg: '#f0fdf4' },
  revision:  { label: 'Revisi',      color: '#ea580c', bg: '#fff7ed' },
}

export default async function MentorClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const service  = createServiceClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify this client belongs to the logged-in mentor
  const { data: client } = await service
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('mentor_id', user.id)
    .single()

  if (!client) notFound()

  const [
    { data: sessions },
    { data: submissions },
    { data: feedbacks },
    { data: videos },
    { data: progress },
    { data: userData },
  ] = await Promise.all([
    service.from('sessions').select('*').eq('user_id', id).order('session_number', { ascending: true }),
    service.from('task_submissions').select('*, task:tasks(id, title, week_number)').eq('user_id', id).order('submitted_at', { ascending: false }),
    service.from('feedbacks').select('*').eq('user_id', id).order('created_at', { ascending: false }),
    service.from('videos').select('id').or(`product.eq.all,product.eq.${client.product}`),
    service.from('video_progress').select('id').eq('user_id', id),
    service.auth.admin.getUserById(id),
  ])

  const pct = (videos?.length ?? 0) > 0
    ? Math.round(((progress?.length ?? 0) / (videos?.length ?? 1)) * 100)
    : 0

  const now = new Date()
  const activeUntil = new Date(client.active_until)
  const expired = activeUntil < now
  const daysLeft = Math.ceil((activeUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const onlineSessions  = sessions?.filter(s => s.session_type === 'online').length ?? 0
  const offlineSessions = sessions?.filter(s => s.session_type === 'offline').length ?? 0
  const doneSessions    = sessions?.filter(s => s.status === 'done').length ?? 0
  const isPrivate = client.product !== 'fastrack' && client.product !== 'all'

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <Link href="/mentor" className="inline-flex items-center gap-2 text-[#9CA3AF] text-sm hover:text-[#1E1B4B] transition-colors mb-4 cursor-pointer">
          <ArrowLeft size={14} /> Kembali ke Overview
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1E1B4B]">{client.full_name}</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">{client.university} · {userData?.user?.email}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-xs bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20 px-3 py-1 rounded-full font-semibold">
              {PRODUCT_LABELS[client.product] ?? client.product}
            </span>
            {expired ? (
              <span className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-1 rounded-full font-semibold">Akses Berakhir</span>
            ) : (
              <span className="text-xs text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full font-semibold">{daysLeft} hari lagi</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Stats */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Progress video */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Progress Video</p>
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xl font-bold text-[#1E1B4B]">{pct}%</p>
              <p className="text-xs text-[#9CA3AF]">{progress?.length ?? 0}/{videos?.length ?? 0}</p>
            </div>
            <div className="h-2 bg-[#f4f8ff] rounded-full overflow-hidden border border-gray-100">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#2232dd,#4DD9C0)' }} />
            </div>
          </div>

          {/* Session stats (private only) */}
          {isPrivate && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Progress Sesi (9x)</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-[#6B6B8A]">
                    <CheckCircle size={13} className="text-green-500" /> Selesai
                  </span>
                  <span className="font-bold text-[#1E1B4B] text-sm">{doneSessions}/9</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-[#6B6B8A]">
                    <Video size={13} className="text-[#2232dd]" /> Online
                  </span>
                  <span className="font-bold text-[#1E1B4B] text-sm">{onlineSessions}/6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-[#6B6B8A]">
                    <MapPin size={13} className="text-orange-500" /> Offline (Lampung)
                  </span>
                  <span className="font-bold text-[#1E1B4B] text-sm">{offlineSessions}/3</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Sesi */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">Jadwal Sesi</h2>
              <p className="text-[#9CA3AF] text-xs mt-0.5">
                {doneSessions} selesai · {sessions?.filter(s => s.status === 'upcoming').length ?? 0} upcoming
              </p>
            </div>
            {!sessions || sessions.length === 0 ? (
              <p className="text-center text-[#9CA3AF] text-sm py-10">Belum ada sesi dijadwalkan</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {sessions.map(s => {
                  const upcoming = s.status === 'upcoming'
                  const date = s.scheduled_at
                    ? new Date(s.scheduled_at).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Belum dijadwalkan'
                  const time = s.scheduled_at
                    ? new Date(s.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                    : ''
                  return (
                    <div key={s.id} className="px-6 py-4 flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${upcoming ? 'bg-[#2232dd] text-white' : 'bg-gray-100 text-[#9CA3AF]'}`}>
                        {s.session_number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-[#1E1B4B] text-sm">Pertemuan {s.session_number}</p>
                          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${upcoming ? 'bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                            {upcoming ? <Clock size={10} /> : <CheckCircle size={10} />}
                            {upcoming ? 'Upcoming' : 'Selesai'}
                          </span>
                        </div>
                        <p className="text-[#9CA3AF] text-xs">{date}{time ? ` · ${time} WIB` : ''}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1 text-[#9CA3AF] text-xs">
                            {s.session_type === 'online' ? <Video size={10} /> : <MapPin size={10} />}
                            {s.session_type}
                          </span>
                          {s.zoom_link && (
                            <a href={s.zoom_link} target="_blank" rel="noopener noreferrer" className="text-[#2232dd] text-xs hover:underline">Zoom link</a>
                          )}
                        </div>
                        {s.notes && <p className="text-[#6B6B8A] text-xs mt-1.5 bg-[#f4f8ff] px-2.5 py-1.5 rounded-lg border border-[#2232dd]/10">{s.notes}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Task Submissions — interactive (review) */}
        <div className="lg:col-span-3">
          <MentorReviewClient
            clientId={id}
            submissions={(submissions ?? []) as TaskSubmission[]}
            feedbacks={(feedbacks ?? []) as Feedback[]}
            clientProfile={client as Profile}
          />
        </div>
      </div>
    </div>
  )
}
