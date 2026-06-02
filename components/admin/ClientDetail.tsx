'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2, Pencil, Trash2, Video, MapPin, CheckCircle, Clock } from 'lucide-react'
import {
  updateClientAction,
  createSessionAction,
  updateSessionAction,
  deleteSessionAction,
  sendPasswordResetAction,
} from '@/app/(admin)/admin/actions'
import type { Profile, Session } from '@/types'

const INPUT = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all'
const SELECT = INPUT + ' bg-white cursor-pointer'

const EMPTY_SESSION: {
  session_number: number
  session_type: 'online' | 'offline'
  scheduled_at: string
  zoom_link: string
  notes: string
  status: 'upcoming' | 'done'
} = {
  session_number: 1, session_type: 'online',
  scheduled_at: '', zoom_link: '', notes: '', status: 'upcoming',
}

interface Props {
  profile: Profile
  sessions: Session[]
  videoProgress: { total: number; watched: number }
  email: string
}

export default function ClientDetail({ profile, sessions, videoProgress, email }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetPending, startResetTransition] = useTransition()

  const handleSendReset = () => {
    startResetTransition(async () => {
      await sendPasswordResetAction(email)
      setResetSent(true)
      setTimeout(() => setResetSent(false), 4000)
    })
  }

  // Profile edit
  const [profileForm, setProfileForm] = useState({
    full_name: profile.full_name ?? '',
    university: profile.university ?? '',
    phone: profile.phone ?? '',
    product: profile.product ?? 'fastrack',
    active_until: profile.active_until ? profile.active_until.split('T')[0] : '',
  })

  // Session modal
  const [sessionModal, setSessionModal] = useState<'add' | string | null>(null)
  const [sessionForm, setSessionForm] = useState(EMPTY_SESSION)
  const [sessionError, setSessionError] = useState('')
  const [sessionPending, startSessionTransition] = useTransition()

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await updateClientAction(profile.id, profileForm as { full_name: string; university: string; phone: string; product: string; active_until: string })
      if (res.error) { setError(res.error); return }
      setSuccessMsg('Profil berhasil disimpan')
      setTimeout(() => setSuccessMsg(''), 3000)
      router.refresh()
    })
  }

  const openAddSession = () => {
    const nextNum = sessions.length > 0 ? Math.max(...sessions.map(s => s.session_number)) + 1 : 1
    setSessionForm({ ...EMPTY_SESSION, session_number: nextNum })
    setSessionError('')
    setSessionModal('add')
  }

  const openEditSession = (s: Session) => {
    setSessionForm({
      session_number: s.session_number,
      session_type: s.session_type,
      scheduled_at: s.scheduled_at ? s.scheduled_at.slice(0, 16) : '',
      zoom_link: s.zoom_link ?? '',
      notes: s.notes ?? '',
      status: s.status,
    })
    setSessionError('')
    setSessionModal(s.id)
  }

  const handleSessionSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSessionError('')
    startSessionTransition(async () => {
      const data = { ...sessionForm, user_id: profile.id }
      const res = sessionModal === 'add'
        ? await createSessionAction(data)
        : await updateSessionAction(sessionModal!, profile.id, sessionForm)
      if (res.error) { setSessionError(res.error); return }
      setSessionModal(null)
      router.refresh()
    })
  }

  const handleDeleteSession = (sessionId: string) => {
    if (!confirm('Hapus sesi ini?')) return
    startSessionTransition(async () => {
      await deleteSessionAction(sessionId, profile.id)
      router.refresh()
    })
  }

  const pct = videoProgress.total > 0 ? Math.round((videoProgress.watched / videoProgress.total) * 100) : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile edit form */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-[#1E1B4B] text-base mb-5">Edit Profil</h2>
          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>}
            {successMsg && <p className="text-green-600 text-xs bg-green-50 border border-green-100 rounded-xl px-3 py-2">{successMsg}</p>}
            <div>
              <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Nama Lengkap</label>
              <input value={profileForm.full_name} onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))} className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Universitas</label>
              <input value={profileForm.university} onChange={e => setProfileForm(f => ({ ...f, university: e.target.value }))} className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">No. HP</label>
              <input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Produk</label>
              <select value={profileForm.product} onChange={e => setProfileForm(f => ({ ...f, product: e.target.value as import('@/types').Product }))} className={SELECT}>
                <option value="fastrack">Fastrack</option>
                <option value="mentoring-sempro">Mentoring Sempro</option>
                <option value="mentoring-penelitian">Mentoring Penelitian</option>
                <option value="all">All Access</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Aktif Sampai</label>
              <input type="date" value={profileForm.active_until} onChange={e => setProfileForm(f => ({ ...f, active_until: e.target.value }))} className={INPUT} />
            </div>
            <button type="submit" disabled={isPending}
              className="bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-1">
              {isPending ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
            </button>
            {email && (
              <button type="button" onClick={handleSendReset} disabled={resetPending || resetSent}
                className="border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
                {resetPending ? <><Loader2 size={14} className="animate-spin" /> Mengirim...</>
                  : resetSent ? '✓ Email terkirim!'
                  : `Kirim Reset Password`}
              </button>
            )}
          </form>

          {/* Stats */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Progress Video</p>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-[#1E1B4B]">{pct}%</p>
              <p className="text-xs text-[#9CA3AF]">{videoProgress.watched}/{videoProgress.total} video</p>
            </div>
            <div className="h-2 bg-[#f4f8ff] rounded-full overflow-hidden border border-gray-100">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#2232dd,#4DD9C0)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Sessions */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-[#1E1B4B] text-base">Jadwal Sesi</h2>
              <p className="text-[#9CA3AF] text-xs mt-0.5">{sessions.filter(s => s.status === 'done').length} selesai · {sessions.filter(s => s.status === 'upcoming').length} upcoming</p>
            </div>
            <button onClick={openAddSession}
              className="flex items-center gap-2 bg-[#2232dd] text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#1a28b8] transition-colors cursor-pointer">
              <Plus size={13} /> Tambah Sesi
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[#9CA3AF] text-sm">Belum ada sesi. Tambahkan sesi pertama.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {sessions.sort((a, b) => a.session_number - b.session_number).map(s => {
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
                          <a href={s.zoom_link} target="_blank" rel="noopener noreferrer"
                            className="text-[#2232dd] text-xs hover:underline">Zoom link</a>
                        )}
                      </div>
                      {s.notes && <p className="text-[#6B6B8A] text-xs mt-1.5 bg-[#f4f8ff] px-2.5 py-1.5 rounded-lg border border-[#2232dd]/10">{s.notes}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => openEditSession(s)}
                        className="p-1.5 rounded-lg hover:bg-[#eff6ff] text-[#9CA3AF] hover:text-[#2232dd] transition-colors cursor-pointer">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDeleteSession(s.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors cursor-pointer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Session Modal */}
      {sessionModal !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">
                {sessionModal === 'add' ? 'Tambah Sesi' : 'Edit Sesi'}
              </h2>
              <button onClick={() => setSessionModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={16} className="text-[#9CA3AF]" />
              </button>
            </div>
            <form onSubmit={handleSessionSave} className="p-6 flex flex-col gap-4">
              {sessionError && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{sessionError}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">No. Sesi</label>
                  <input type="number" min={1} value={sessionForm.session_number}
                    onChange={e => setSessionForm(f => ({ ...f, session_number: Number(e.target.value) }))} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Tipe</label>
                  <select value={sessionForm.session_type} onChange={e => setSessionForm(f => ({ ...f, session_type: e.target.value as 'online' | 'offline' }))} className={SELECT}>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Tanggal & Waktu</label>
                  <input type="datetime-local" value={sessionForm.scheduled_at}
                    onChange={e => setSessionForm(f => ({ ...f, scheduled_at: e.target.value }))} className={INPUT} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Zoom Link</label>
                  <input value={sessionForm.zoom_link} placeholder="https://zoom.us/..."
                    onChange={e => setSessionForm(f => ({ ...f, zoom_link: e.target.value }))} className={INPUT} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Catatan</label>
                  <textarea value={sessionForm.notes} rows={2} placeholder="Catatan untuk klien..."
                    onChange={e => setSessionForm(f => ({ ...f, notes: e.target.value }))}
                    className={INPUT + ' resize-none'} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Status</label>
                  <select value={sessionForm.status} onChange={e => setSessionForm(f => ({ ...f, status: e.target.value as 'upcoming' | 'done' }))} className={SELECT}>
                    <option value="upcoming">Upcoming</option>
                    <option value="done">Selesai</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setSessionModal(null)}
                  className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={sessionPending}
                  className="flex-1 bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  {sessionPending ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
