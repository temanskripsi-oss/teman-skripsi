'use client'
import { useState, useMemo } from 'react'
import { Users, CheckCircle, Clock, Video, ClipboardList, DollarSign, TrendingUp, Filter } from 'lucide-react'

interface Client {
  id: string; full_name: string; product: string; start_date: string | null
  active_until: string; created_at: string; mentor_id: string | null
  avatar_url: string | null; university: string
}
interface Mentor { id: string; full_name: string }
interface Session { id: string; user_id: string; status: string; session_type: string; scheduled_at: string; session_number: number }
interface SessionSubmission { id: string; user_id: string; session_id: string; status: string }
interface TaskSubmission { id: string; user_id: string; status: string }
interface Payment { user_id: string; amount: number; status: string; payment_date: string }
interface VideoItem { id: string; product: string }
interface VideoProgress { user_id: string; video_id: string }

interface Props {
  clients: Client[]
  mentors: Mentor[]
  sessions: Session[]
  sessionSubmissions: SessionSubmission[]
  taskSubmissions: TaskSubmission[]
  payments: Payment[]
  videos: VideoItem[]
  videoProgress: VideoProgress[]
}

const MONTHS = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
]

const PRODUCT_LABELS: Record<string, string> = {
  fastrack: 'Fastrack',
  'mentoring-sempro': 'Mentoring Sempro',
  'mentoring-penelitian': 'Mentoring Penelitian',
  all: 'All Access',
}

function StatCard({ label, value, icon: Icon, color, bg }: { label: string; value: string | number; icon: React.ElementType; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="p-2.5 rounded-xl w-fit mb-3" style={{ background: bg, color }}>
        <Icon size={16} />
      </div>
      <p className="text-2xl font-bold text-[#1E1B4B] mb-0.5">{value}</p>
      <p className="text-[#9CA3AF] text-xs">{label}</p>
    </div>
  )
}

function fmt(n: number) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`
  return `Rp ${n}`
}

export default function RekapClient({ clients, mentors, sessions, sessionSubmissions, taskSubmissions, payments, videos, videoProgress }: Props) {
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()) // 0-indexed
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMentor, setSelectedMentor] = useState('all')
  const [activeTab, setActiveTab] = useState<'fastrack' | 'privat'>('fastrack')

  const years = useMemo(() => {
    const ys = new Set<number>()
    clients.forEach(c => {
      if (c.start_date) ys.add(new Date(c.start_date).getFullYear())
      ys.add(new Date(c.created_at).getFullYear())
    })
    ys.add(now.getFullYear())
    return [...ys].sort((a, b) => b - a)
  }, [clients])

  // ── FASTRACK ──────────────────────────────────────────────────────────────
  const fastrackClients = useMemo(() => {
    return clients.filter(c => {
      if (c.product !== 'fastrack') return false
      if (!c.start_date) return false
      const d = new Date(c.start_date)
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear
    })
  }, [clients, selectedMonth, selectedYear])

  const fastrackStats = useMemo(() => {
    const ids = new Set(fastrackClients.map(c => c.id))
    const totalVideos = videos.filter(v => v.product === 'fastrack' || v.product === 'all').length
    const revenue = payments.filter(p => ids.has(p.user_id) && p.status === 'paid').reduce((s, p) => s + p.amount, 0)
    const taskSubs = taskSubmissions.filter(t => ids.has(t.user_id))
    const taskDone = taskSubs.filter(t => t.status === 'reviewed').length
    const videosWatched = videoProgress.filter(vp => ids.has(vp.user_id)).length
    const avgVideoProgress = fastrackClients.length > 0 && totalVideos > 0
      ? Math.round(videosWatched / fastrackClients.length / totalVideos * 100)
      : 0

    return { revenue, taskDone, taskTotal: taskSubs.length, avgVideoProgress }
  }, [fastrackClients, payments, taskSubmissions, videoProgress, videos])

  // ── PRIVAT ────────────────────────────────────────────────────────────────
  const privatClients = useMemo(() => {
    return clients.filter(c => {
      const isPrivat = c.product === 'mentoring-sempro' || c.product === 'mentoring-penelitian'
      if (!isPrivat) return false
      if (!c.start_date) return false
      const d = new Date(c.start_date)
      if (d.getMonth() !== selectedMonth || d.getFullYear() !== selectedYear) return false
      if (selectedMentor !== 'all' && c.mentor_id !== selectedMentor) return false
      return true
    })
  }, [clients, selectedMonth, selectedYear, selectedMentor])

  const getClientPrivatStats = (clientId: string) => {
    const clientSessions = sessions.filter(s => s.user_id === clientId)
    const done = clientSessions.filter(s => s.status === 'done').length
    const upcoming = clientSessions.filter(s => s.status === 'upcoming').length
    const online = clientSessions.filter(s => s.session_type === 'online').length
    const offline = clientSessions.filter(s => s.session_type === 'offline').length
    const subs = sessionSubmissions.filter(s => s.user_id === clientId)
    const subDone = subs.filter(s => s.status === 'disetujui').length
    const subRevisi = subs.filter(s => s.status === 'revisi').length
    const subPending = subs.filter(s => s.status === 'submitted').length
    return { done, upcoming, online, offline, subDone, subRevisi, subPending, total: clientSessions.length }
  }

  const privatStats = useMemo(() => {
    const ids = new Set(privatClients.map(c => c.id))
    const allSessions = sessions.filter(s => ids.has(s.user_id))
    const done = allSessions.filter(s => s.status === 'done').length
    const upcoming = allSessions.filter(s => s.status === 'upcoming').length
    const subs = sessionSubmissions.filter(s => ids.has(s.user_id))
    const subDone = subs.filter(s => s.status === 'disetujui').length
    const subRevisi = subs.filter(s => s.status === 'revisi').length
    return { done, upcoming, subDone, subRevisi }
  }, [privatClients, sessions, sessionSubmissions])

  const mentorName = (mentorId: string | null) =>
    mentors.find(m => m.id === mentorId)?.full_name ?? '—'

  const activeUntilStatus = (dateStr: string) => {
    const d = new Date(dateStr)
    const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return { label: 'Expired', color: 'text-red-500', bg: 'bg-red-50 border-red-100' }
    if (diff <= 14) return { label: `${diff}h lagi`, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100' }
    return { label: 'Aktif', color: 'text-green-600', bg: 'bg-green-50 border-green-100' }
  }

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Rekap Batch</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Analitik detail per batch bulan.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-6 flex flex-wrap items-center gap-3">
        <Filter size={14} className="text-[#9CA3AF]" />
        <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#7C6FCD]/30 cursor-pointer bg-white">
          {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#7C6FCD]/30 cursor-pointer bg-white">
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        {activeTab === 'privat' && (
          <select value={selectedMentor} onChange={e => setSelectedMentor(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#7C6FCD]/30 cursor-pointer bg-white">
            <option value="all">Semua Mentor</option>
            {mentors.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
          </select>
        )}
        <span className="text-xs text-[#9CA3AF] ml-auto">
          Batch {MONTHS[selectedMonth]} {selectedYear}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['fastrack', 'privat'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === tab
                ? 'bg-[#1E1B4B] text-white'
                : 'bg-white text-[#6B6B8A] border border-gray-200 hover:bg-gray-50'
            }`}>
            {tab === 'fastrack' ? 'Fastrack' : 'Mentoring Privat'}
          </button>
        ))}
      </div>

      {/* ── FASTRACK TAB ── */}
      {activeTab === 'fastrack' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Peserta Batch" value={fastrackClients.length} icon={Users} color="#2232dd" bg="#eff6ff" />
            <StatCard label="Revenue Batch" value={fmt(fastrackStats.revenue)} icon={DollarSign} color="#7C6FCD" bg="#f5f3ff" />
            <StatCard label="Tugas Terkumpul" value={`${fastrackStats.taskDone}/${fastrackStats.taskTotal}`} icon={ClipboardList} color="#ea580c" bg="#fff7ed" />
            <StatCard label="Avg. Video Progress" value={`${fastrackStats.avgVideoProgress}%`} icon={Video} color="#16a34a" bg="#f0fdf4" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[#1E1B4B] text-sm">Daftar Peserta — Batch {MONTHS[selectedMonth]} {selectedYear}</h2>
            </div>
            {fastrackClients.length === 0 ? (
              <p className="text-center text-[#9CA3AF] text-sm py-12">Tidak ada peserta fastrack di batch ini</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {fastrackClients.map(c => {
                  const ids = new Set([c.id])
                  const watched = videoProgress.filter(vp => ids.has(vp.user_id)).length
                  const totalVid = videos.filter(v => v.product === 'fastrack' || v.product === 'all').length
                  const pct = totalVid > 0 ? Math.round(watched / totalVid * 100) : 0
                  const tasks = taskSubmissions.filter(t => t.user_id === c.id)
                  const rev = payments.filter(p => p.user_id === c.id && p.status === 'paid').reduce((s, p) => s + p.amount, 0)
                  const status = activeUntilStatus(c.active_until)
                  return (
                    <div key={c.id} className="px-6 py-4 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {c.full_name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1E1B4B] text-sm truncate">{c.full_name}</p>
                        <p className="text-[#9CA3AF] text-xs">{c.university}</p>
                      </div>
                      {/* Video progress bar */}
                      <div className="w-28 hidden sm:block">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-[#9CA3AF]">Video</span>
                          <span className="text-[10px] font-semibold text-[#1E1B4B]">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#2232dd,#4DD9C0)' }} />
                        </div>
                      </div>
                      <div className="text-center hidden md:block w-20">
                        <p className="text-xs font-semibold text-[#1E1B4B]">{tasks.length}</p>
                        <p className="text-[10px] text-[#9CA3AF]">Tugas</p>
                      </div>
                      <div className="text-center hidden md:block w-24">
                        <p className="text-xs font-semibold text-[#1E1B4B]">{fmt(rev)}</p>
                        <p className="text-[10px] text-[#9CA3AF]">Revenue</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── PRIVAT TAB ── */}
      {activeTab === 'privat' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Klien" value={privatClients.length} icon={Users} color="#2232dd" bg="#eff6ff" />
            <StatCard label="Sesi Selesai" value={privatStats.done} icon={CheckCircle} color="#16a34a" bg="#f0fdf4" />
            <StatCard label="Sesi Upcoming" value={privatStats.upcoming} icon={Clock} color="#ea580c" bg="#fff7ed" />
            <StatCard label="PR Disetujui" value={`${privatStats.subDone}`} icon={TrendingUp} color="#7C6FCD" bg="#f5f3ff" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[#1E1B4B] text-sm">
                Detail Klien — {selectedMentor === 'all' ? 'Semua Mentor' : mentorName(selectedMentor)} · Batch {MONTHS[selectedMonth]} {selectedYear}
              </h2>
            </div>
            {privatClients.length === 0 ? (
              <p className="text-center text-[#9CA3AF] text-sm py-12">Tidak ada klien mentoring privat di filter ini</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {privatClients.map(c => {
                  const stats = getClientPrivatStats(c.id)
                  const status = activeUntilStatus(c.active_until)
                  return (
                    <div key={c.id} className="px-6 py-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C6FCD] to-[#4DD9C0] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.full_name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-[#1E1B4B] text-sm">{c.full_name}</p>
                            <span className="text-[10px] bg-[#f5f3ff] text-[#7C6FCD] border border-[#7C6FCD]/20 px-2 py-0.5 rounded-full font-medium">
                              {PRODUCT_LABELS[c.product]}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.bg} ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-[#9CA3AF] text-xs mt-0.5">{c.university} · Mentor: {mentorName(c.mentor_id)}</p>
                        </div>
                      </div>
                      {/* Stats row */}
                      <div className="mt-3 ml-12 grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {[
                          { label: 'Sesi Selesai', value: `${stats.done}/9`, color: 'text-green-600' },
                          { label: 'Upcoming', value: stats.upcoming, color: 'text-[#7C6FCD]' },
                          { label: 'Online', value: `${stats.online}/6`, color: 'text-[#2232dd]' },
                          { label: 'Offline', value: `${stats.offline}/3`, color: 'text-orange-500' },
                          { label: 'PR Disetujui', value: stats.subDone, color: 'text-green-600' },
                          { label: 'PR Revisi', value: stats.subRevisi, color: 'text-orange-500' },
                        ].map((item, i) => (
                          <div key={i} className="bg-[#f4f8ff] rounded-xl px-3 py-2 text-center">
                            <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                            <p className="text-[10px] text-[#9CA3AF] mt-0.5">{item.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
