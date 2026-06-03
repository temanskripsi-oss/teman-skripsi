'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2, Pencil, Trash2, Video, MapPin, CheckCircle, Clock, ClipboardList, ExternalLink, Link2 } from 'lucide-react'
import {
  createSessionAction,
  updateSessionAction,
  deleteSessionAction,
  updateSessionProgressAction,
  reviewSessionSubmissionAction,
} from '@/app/(admin)/admin/actions'
import type { Session, SessionSubmission } from '@/types'

const INPUT  = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#7C6FCD]/30 focus:border-[#7C6FCD] transition-all'
const SELECT = INPUT + ' bg-white cursor-pointer'

const EMPTY_SESSION = {
  session_number: 1, session_type: 'online' as 'online' | 'offline',
  scheduled_at: '', zoom_link: '', notes: '', status: 'upcoming' as 'upcoming' | 'done',
}

interface Props {
  clientId: string
  sessions: Session[]
  sessionSubmissions: SessionSubmission[]
  doneSessions: number
  onlineSessions: number
  offlineSessions: number
}

export default function MentorSessionManager({ clientId, sessions, sessionSubmissions, doneSessions, onlineSessions, offlineSessions }: Props) {
  const router = useRouter()

  // Session modal
  const [sessionModal, setSessionModal] = useState<'add' | string | null>(null)
  const [sessionForm, setSessionForm]   = useState(EMPTY_SESSION)
  const [sessionError, setSessionError] = useState('')
  const [sessionPending, startSessionTransition] = useTransition()

  const openAdd = () => {
    const nextNum = sessions.length > 0 ? Math.max(...sessions.map(s => s.session_number)) + 1 : 1
    setSessionForm({ ...EMPTY_SESSION, session_number: nextNum })
    setSessionError(''); setSessionModal('add')
  }
  const openEdit = (s: Session) => {
    setSessionForm({
      session_number: s.session_number, session_type: s.session_type,
      scheduled_at: s.scheduled_at ? s.scheduled_at.slice(0, 16) : '',
      zoom_link: s.zoom_link ?? '', notes: s.notes ?? '', status: s.status,
    })
    setSessionError(''); setSessionModal(s.id)
  }
  const handleSessionSave = (e: React.FormEvent) => {
    e.preventDefault(); setSessionError('')
    startSessionTransition(async () => {
      const res = sessionModal === 'add'
        ? await createSessionAction({ ...sessionForm, user_id: clientId })
        : await updateSessionAction(sessionModal!, clientId, sessionForm)
      if (res.error) { setSessionError(res.error); return }
      setSessionModal(null); router.refresh()
    })
  }
  const handleDelete = (sessionId: string) => {
    if (!confirm('Hapus sesi ini?')) return
    startSessionTransition(async () => { await deleteSessionAction(sessionId, clientId); router.refresh() })
  }

  // Progress modal (catatan + PR)
  const [progressModal, setProgressModal] = useState<Session | null>(null)
  const [progressForm, setProgressForm]   = useState({ catatan_sesi: '', pr_description: '', session_file_url: '' })
  const [progressError, setProgressError] = useState('')
  const [progressPending, startProgressTransition] = useTransition()

  const openProgress = (s: Session) => {
    setProgressForm({ catatan_sesi: s.catatan_sesi ?? '', pr_description: s.pr_description ?? '', session_file_url: s.session_file_url ?? '' })
    setProgressError(''); setProgressModal(s)
  }
  const handleProgressSave = (e: React.FormEvent) => {
    e.preventDefault(); setProgressError('')
    startProgressTransition(async () => {
      const res = await updateSessionProgressAction(progressModal!.id, clientId, progressForm)
      if (res.error) { setProgressError(res.error); return }
      setProgressModal(null); router.refresh()
    })
  }

  // Session submission review
  const [reviewModal, setReviewModal] = useState<SessionSubmission | null>(null)
  const [reviewForm, setReviewForm]   = useState({ status: 'disetujui' as 'disetujui' | 'revisi', mentor_feedback: '' })
  const [reviewError, setReviewError] = useState('')
  const [reviewPending, startReviewTransition] = useTransition()

  const openReview = (s: SessionSubmission) => {
    setReviewForm({ status: s.status === 'revisi' ? 'revisi' : 'disetujui', mentor_feedback: s.mentor_feedback ?? '' })
    setReviewError(''); setReviewModal(s)
  }
  const handleReviewSave = (e: React.FormEvent) => {
    e.preventDefault(); setReviewError('')
    startReviewTransition(async () => {
      const res = await reviewSessionSubmissionAction(reviewModal!.id, clientId, reviewForm)
      if (res.error) { setReviewError(res.error); return }
      setReviewModal(null); router.refresh()
    })
  }

  const sessSubsMap: Record<string, SessionSubmission> = {}
  sessionSubmissions.forEach(s => { sessSubsMap[s.session_id] = s })

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[#1E1B4B] text-base">Jadwal & Progress Sesi</h2>
            <p className="text-[#9CA3AF] text-xs mt-0.5">
              {doneSessions} selesai · {sessions.filter(s => s.status === 'upcoming').length} upcoming
              · Online {onlineSessions}/6 · Offline {offlineSessions}/3 · Written {doneSessions}/9
            </p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-1.5 bg-[#7C6FCD] text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#6b5fc0] transition-colors cursor-pointer">
            <Plus size={13} /> Tambah Sesi
          </button>
        </div>

        {sessions.length === 0 ? (
          <p className="text-center text-[#9CA3AF] text-sm py-10">Belum ada sesi. Klik "Tambah Sesi" untuk mulai.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {sessions.map(s => {
              const upcoming = s.status === 'upcoming'
              const sessSub  = sessSubsMap[s.id]
              const date = s.scheduled_at
                ? new Date(s.scheduled_at).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
                : 'Belum dijadwalkan'
              const time = s.scheduled_at
                ? new Date(s.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                : ''

              return (
                <div key={s.id} className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${upcoming ? 'bg-[#7C6FCD] text-white' : 'bg-gray-100 text-[#9CA3AF]'}`}>
                      {s.session_number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-[#1E1B4B] text-sm">Pertemuan {s.session_number}</p>
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${upcoming ? 'bg-[#f5f3ff] text-[#7C6FCD] border border-[#7C6FCD]/20' : 'bg-green-50 text-green-600 border border-green-100'}`}>
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
                          <a href={s.zoom_link} target="_blank" rel="noopener noreferrer" className="text-[#7C6FCD] text-xs hover:underline">Zoom link</a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => openProgress(s)} title="Catatan & PR"
                        className="p-1.5 rounded-lg hover:bg-orange-50 text-[#9CA3AF] hover:text-orange-500 transition-colors cursor-pointer">
                        <ClipboardList size={13} />
                      </button>
                      <button onClick={() => openEdit(s)}
                        className="p-1.5 rounded-lg hover:bg-[#f5f3ff] text-[#9CA3AF] hover:text-[#7C6FCD] transition-colors cursor-pointer">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors cursor-pointer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Catatan + PR + File */}
                  {(s.catatan_sesi || s.pr_description || s.session_file_url) && (
                    <div className="mt-3 flex flex-col gap-2" style={{ paddingLeft: '52px' }}>
                      {s.catatan_sesi && (
                        <div className="bg-[#f5f3ff] rounded-lg px-3 py-2 border border-[#7C6FCD]/10">
                          <p className="text-xs font-semibold text-[#7C6FCD] mb-0.5">📝 Catatan</p>
                          <p className="text-xs text-[#1E1B4B] line-clamp-2">{s.catatan_sesi}</p>
                        </div>
                      )}
                      {s.pr_description && (
                        <div className="bg-orange-50 rounded-lg px-3 py-2 border border-orange-100">
                          <p className="text-xs font-semibold text-orange-600 mb-0.5">📋 PR</p>
                          <p className="text-xs text-[#1E1B4B] line-clamp-2">{s.pr_description}</p>
                        </div>
                      )}
                      {s.session_file_url && (
                        <a href={s.session_file_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 hover:border-[#7C6FCD]/30 transition-colors">
                          <Link2 size={11} className="text-[#7C6FCD] flex-shrink-0" />
                          <p className="text-xs text-[#7C6FCD] font-medium truncate">Lihat file / materi</p>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Submission */}
                  {sessSub && (
                    <div className="mt-2 flex items-center gap-3" style={{ paddingLeft: '52px' }}>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        sessSub.status === 'disetujui' ? 'bg-green-50 text-green-600 border-green-100' :
                        sessSub.status === 'revisi'    ? 'bg-orange-50 text-orange-500 border-orange-100' :
                        'bg-[#f5f3ff] text-[#7C6FCD] border-[#7C6FCD]/20'
                      }`}>
                        {sessSub.status === 'disetujui' ? '✓ Disetujui' : sessSub.status === 'revisi' ? '↺ Revisi' : '⏳ Dikirim'}
                      </span>
                      <a href={sessSub.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-[#7C6FCD] hover:underline">
                        <ExternalLink size={11} /> Lihat PR
                      </a>
                      <button onClick={() => openReview(sessSub)}
                        className="text-xs text-[#7C6FCD] hover:underline cursor-pointer font-medium">
                        Review
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Session Modal */}
      {sessionModal !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">{sessionModal === 'add' ? 'Tambah Sesi' : 'Edit Sesi'}</h2>
              <button onClick={() => setSessionModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
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
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Tanggal & Waktu</label>
                <input type="datetime-local" value={sessionForm.scheduled_at}
                  onChange={e => setSessionForm(f => ({ ...f, scheduled_at: e.target.value }))} className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Zoom Link</label>
                <input value={sessionForm.zoom_link} placeholder="https://zoom.us/..."
                  onChange={e => setSessionForm(f => ({ ...f, zoom_link: e.target.value }))} className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Catatan Umum</label>
                <textarea value={sessionForm.notes} rows={2} placeholder="Catatan untuk klien..."
                  onChange={e => setSessionForm(f => ({ ...f, notes: e.target.value }))}
                  className={INPUT + ' resize-none'} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Status</label>
                <select value={sessionForm.status} onChange={e => setSessionForm(f => ({ ...f, status: e.target.value as 'upcoming' | 'done' }))} className={SELECT}>
                  <option value="upcoming">Upcoming</option>
                  <option value="done">Selesai</option>
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setSessionModal(null)}
                  className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer">Batal</button>
                <button type="submit" disabled={sessionPending}
                  className="flex-1 bg-[#7C6FCD] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#6b5fc0] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2">
                  {sessionPending ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Progress Modal */}
      {progressModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">Catatan & PR — Sesi {progressModal.session_number}</h2>
              <button onClick={() => setProgressModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                <X size={16} className="text-[#9CA3AF]" />
              </button>
            </div>
            <form onSubmit={handleProgressSave} className="p-6 flex flex-col gap-4">
              {progressError && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{progressError}</p>}
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">📝 Catatan Sesi</label>
                <textarea value={progressForm.catatan_sesi} rows={3} placeholder="Apa yang dibahas di sesi ini..."
                  onChange={e => setProgressForm(f => ({ ...f, catatan_sesi: e.target.value }))}
                  className={INPUT + ' resize-none'} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">📋 PR untuk Klien</label>
                <textarea value={progressForm.pr_description} rows={3} placeholder="Tugas yang harus dikerjakan sebelum sesi berikutnya..."
                  onChange={e => setProgressForm(f => ({ ...f, pr_description: e.target.value }))}
                  className={INPUT + ' resize-none'} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">🔗 Link File / Materi</label>
                <input value={progressForm.session_file_url} placeholder="https://drive.google.com/..."
                  onChange={e => setProgressForm(f => ({ ...f, session_file_url: e.target.value }))} className={INPUT} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setProgressModal(null)}
                  className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer">Batal</button>
                <button type="submit" disabled={progressPending}
                  className="flex-1 bg-[#7C6FCD] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#6b5fc0] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2">
                  {progressPending ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">Review PR Klien</h2>
              <button onClick={() => setReviewModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                <X size={16} className="text-[#9CA3AF]" />
              </button>
            </div>
            <form onSubmit={handleReviewSave} className="p-6 flex flex-col gap-4">
              {reviewError && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{reviewError}</p>}
              <div className="bg-[#f5f3ff] rounded-xl px-4 py-3 border border-[#7C6FCD]/10">
                <a href={reviewModal.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[#7C6FCD] hover:underline font-medium">
                  <ExternalLink size={13} /> Lihat file submission klien
                </a>
                {reviewModal.notes && <p className="text-xs text-[#6B6B8A] mt-1.5">Catatan: {reviewModal.notes}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Status</label>
                <div className="flex gap-3">
                  {(['disetujui', 'revisi'] as const).map(v => (
                    <button key={v} type="button" onClick={() => setReviewForm(f => ({ ...f, status: v }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                        reviewForm.status === v
                          ? v === 'disetujui' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-500 border-orange-200'
                          : 'border-gray-200 text-[#9CA3AF] hover:bg-gray-50'
                      }`}>
                      {v === 'disetujui' ? '✓ Disetujui' : '↺ Revisi'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Feedback</label>
                <textarea value={reviewForm.mentor_feedback} rows={3} placeholder="Tulis feedback untuk klien..."
                  onChange={e => setReviewForm(f => ({ ...f, mentor_feedback: e.target.value }))}
                  className={INPUT + ' resize-none'} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setReviewModal(null)}
                  className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer">Batal</button>
                <button type="submit" disabled={reviewPending}
                  className="flex-1 bg-[#7C6FCD] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#6b5fc0] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2">
                  {reviewPending ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
