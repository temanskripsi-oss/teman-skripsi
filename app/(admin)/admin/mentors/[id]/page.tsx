import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Mail, Phone, Users, GraduationCap, Video, ClipboardList } from 'lucide-react'

const PRODUCT_CONFIG = {
  'fastrack':             { label: 'Fast Track Sempro',        color: '#2232dd', bg: '#eff6ff', border: '#2232dd20' },
  'mentoring-sempro':     { label: 'Mentoring Privat Sempro',  color: '#7C6FCD', bg: '#f5f3ff', border: '#7C6FCD20' },
  'mentoring-penelitian': { label: 'Mentoring Privat Bab 4–5', color: '#0f766e', bg: '#f0fdfa', border: '#0f766e20' },
} as const

export default async function MentorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()

  const [{ data: mentorData }, { data: clients }, { data: videoProgress }, { data: taskSubs }] = await Promise.all([
    supabase.auth.admin.getUserById(id),
    supabase.from('profiles').select('*').eq('mentor_id', id).eq('role', 'user').order('created_at', { ascending: false }),
    supabase.from('video_progress').select('user_id'),
    supabase.from('task_submissions').select('user_id, status'),
  ])

  const { data: mentorProfile } = await supabase.from('profiles').select('*').eq('id', id).single()
  if (!mentorProfile || mentorProfile.role !== 'mentor') notFound()

  const clientList = clients ?? []

  const getVideoCount  = (uid: string) => videoProgress?.filter(v => v.user_id === uid).length ?? 0
  const getTasksDone   = (uid: string) => taskSubs?.filter(t => t.user_id === uid && t.status === 'reviewed').length ?? 0
  const getTasksPending= (uid: string) => taskSubs?.filter(t => t.user_id === uid && t.status === 'submitted').length ?? 0

  const grouped = Object.entries(PRODUCT_CONFIG).map(([key, cfg]) => ({
    key, cfg,
    clients: clientList.filter(c => c.product === key),
  })).filter(g => g.clients.length > 0)

  return (
    <div className="p-8 max-w-5xl">
      {/* Back */}
      <Link href="/admin/mentors" className="inline-flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#1E1B4B] text-sm mb-6 transition-colors">
        <ChevronLeft size={16} /> Kembali ke daftar mentor
      </Link>

      {/* Mentor card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 flex items-center gap-5">
        {mentorProfile.avatar_url ? (
          <Image src={mentorProfile.avatar_url} alt={mentorProfile.full_name} width={64} height={64}
            className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C6FCD] to-[#2232dd] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {mentorProfile.full_name?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#1E1B4B]">{mentorProfile.full_name}</h1>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-[#9CA3AF] text-sm">
              <Mail size={13} /> {mentorData?.user?.email ?? '—'}
            </span>
            {mentorProfile.phone && (
              <span className="flex items-center gap-1.5 text-[#9CA3AF] text-sm">
                <Phone size={13} /> {mentorProfile.phone}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-[#9CA3AF] text-sm">
              <Users size={13} /> {clientList.length} klien aktif
            </span>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#f5f3ff] text-[#7C6FCD] border border-[#7C6FCD]/20">
          Mentor
        </span>
      </div>

      {/* Clients grouped by product */}
      {grouped.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
            <Users size={22} className="text-[#2232dd]" />
          </div>
          <p className="font-semibold text-[#1E1B4B] text-sm mb-1">Belum ada klien</p>
          <p className="text-[#9CA3AF] text-xs">Assign klien ke mentor ini melalui halaman detail klien</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(({ key, cfg, clients: groupClients }) => (
            <div key={key}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full border"
                  style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
                  {cfg.label}
                </span>
                <span className="text-[#9CA3AF] text-xs">{groupClients.length} klien</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#fafafa]">
                      <th className="text-left px-5 py-3 text-[#9CA3AF] text-xs font-semibold">Klien</th>
                      <th className="text-left px-5 py-3 text-[#9CA3AF] text-xs font-semibold hidden md:table-cell">Universitas</th>
                      <th className="text-left px-5 py-3 text-[#9CA3AF] text-xs font-semibold">
                        <span className="flex items-center gap-1"><Video size={11} /> Video</span>
                      </th>
                      <th className="text-left px-5 py-3 text-[#9CA3AF] text-xs font-semibold">
                        <span className="flex items-center gap-1"><ClipboardList size={11} /> Tugas</span>
                      </th>
                      <th className="text-left px-5 py-3 text-[#9CA3AF] text-xs font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {groupClients.map(client => {
                      const isExpired   = client.active_until ? new Date(client.active_until) < new Date() : false
                      const videosWatched = getVideoCount(client.id)
                      const tasksDone    = getTasksDone(client.id)
                      const tasksPending = getTasksPending(client.id)
                      return (
                        <tr key={client.id} className="hover:bg-[#f4f8ff]/40 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}99)` }}>
                                {client.full_name?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-[#1E1B4B] text-sm">{client.full_name}</p>
                                <Link href={`/admin/clients/${client.id}`}
                                  className="text-[#2232dd] text-xs hover:underline" onClick={e => e.stopPropagation()}>
                                  Lihat detail →
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-[#6B6B8A] text-sm hidden md:table-cell">
                            <span className="flex items-center gap-1"><GraduationCap size={12} className="text-[#9CA3AF]" /> {client.university ?? '—'}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-sm font-semibold text-[#1E1B4B]">{videosWatched}</span>
                            <span className="text-[#9CA3AF] text-xs ml-0.5">ditonton</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#16a34a]">{tasksDone} selesai</span>
                              {tasksPending > 0 && (
                                <span className="text-xs bg-orange-50 text-orange-500 border border-orange-100 px-2 py-0.5 rounded-full font-semibold">
                                  {tasksPending} pending
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                              isExpired
                                ? 'bg-red-50 text-red-500 border-red-100'
                                : 'bg-green-50 text-[#16a34a] border-green-100'
                            }`}>
                              {isExpired ? 'Expired' : 'Aktif'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
