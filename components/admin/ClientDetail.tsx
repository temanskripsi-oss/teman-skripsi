'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2, Pencil, Trash2, Video, MapPin, CheckCircle, Clock, FileText, ExternalLink, ClipboardList, RotateCcw } from 'lucide-react'
import {
  updateClientAction,
  createSessionAction,
  updateSessionAction,
  deleteSessionAction,
  sendPasswordResetAction,
  createFeedbackAction,
  updateFeedbackAction,
  deleteFeedbackAction,
  reviewSubmissionAction,
} from '@/app/(admin)/admin/actions'
import type { Profile, Session, Feedback, TaskSubmission } from '@/types'

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

const EMPTY_FEEDBACK: {
  title: string
  description: string
  type: 'pdf' | 'video'
  url: string
  session_number: number | null
} = { title: '', description: '', type: 'pdf', url: '', session_number: null }

interface MentorOption { id: string; full_name: string }

interface Props {
  profile: Profile
  sessions: Session[]
  feedbacks: Feedback[]
  submissions: TaskSubmission[]
  videoProgress: { total: number; watched: number }
  email: string
  mentors: MentorOption[]
}

export default function ClientDetail({ profile, sessions, feedbacks, submissions, videoProgress, email, mentors }: Props) {
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
    mentor_id: profile.mentor_id ?? '',
    start_date: profile.start_date ?? '',
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
      const res = await updateClientAction(profile.id, {
        ...profileForm,
        mentor_id: profileForm.mentor_id || null,
        start_date: profileForm.start_date || null,
      })
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

  // Feedback
  const [feedbackModal, setFeedbackModal] = useState<'add' | string | null>(null)
  const [feedbackForm, setFeedbackForm] = useState(EMPTY_FEEDBACK)
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackPending, startFeedbackTransition] = useTransition()

  const openAddFeedback = () => {
    setFeedbackForm(EMPTY_FEEDBACK)
    setFeedbackError('')
    setFeedbackModal('add')
  }

  const openEditFeedback = (f: Feedback) => {
    setFeedbackForm({
      title: f.title,
      description: f.description,
      type: f.type,
      url: f.url,
      session_number: f.session_number,
    })
    setFeedbackError('')
    setFeedbackModal(f.id)
  }

  const handleFeedbackSave = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackError('')
    startFeedbackTransition(async () => {
      const res = feedbackModal === 'add'
        ? await createFeedbackAction({ ...feedbackForm, user_id: profile.id })
        : await updateFeedbackAction(feedbackModal!, profile.id, feedbackForm)
      if (res.error) { setFeedbackError(res.error); return }
      setFeedbackModal(null)
      router.refresh()
    })
  }

  const handleDeleteFeedback = (feedbackId: string) => {
    if (!confirm('Hapus feedback ini?')) return
    startFeedbackTransition(async () => {
      await deleteFeedbackAction(feedbackId, profile.id)
      router.refresh()
    })
  }

  // Submission review
  const [reviewModal, setReviewModal] = useState<TaskSubmission | null>(null)
  const [reviewForm, setReviewForm] = useState({ status: 'reviewed' as 'reviewed' | 'revision', mentor_feedback: '' })
  const [reviewError, setReviewError] = useState('')
  const [reviewPending, startReviewTransition] = useTransition()

  const openReview = (s: TaskSubmission) => {
    setReviewForm({ status: s.status === 'revision' ? 'revision' : 'reviewed', mentor_feedback: s.mentor_feedback ?? '' })
    setReviewError('')
    setReviewModal(s)
  }

  const handleReviewSave = (e: React.FormEvent) => {
    e.preventDefault()
    setReviewError('')
    startReviewTransition(async () => {
      const res = await reviewSubmissionAction(reviewModal!.id, profile.id, reviewForm)
      if (res.error) { setReviewError(res.error); return }
      setReviewModal(null)
      router.refresh()
    })
  }

  const STATUS_LABEL: Record<string, { label: string; color: string; bg: string; border: string }> = {
    submitted: { label: 'Dikumpulkan', color: '#2232dd', bg: '#eff6ff', border: '#2232dd/20' },
    reviewed:  { label: 'Disetujui',   color: '#16a34a', bg: '#f0fdf4', border: '#16a34a/20' },
    revision:  { label: 'Revisi',      color: '#ea580c', bg: '#fff7ed', border: '#ea580c/20' },
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
              <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Email</label>
              <input value={email} readOnly className={INPUT + ' bg-gray-50 text-[#9CA3AF] cursor-not-allowed'} />
            </div>
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
            <div>
              <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Mentor</label>
              <select value={profileForm.mentor_id} onChange={e => setProfileForm(f => ({ ...f, mentor_id: e.target.value }))} className={SELECT}>
                <option value="">— Belum di-assign —</option>
                {mentors.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
              </select>
              {profileForm.mentor_id && (
                <button type="button"
                  onClick={() => {
                    const months = profileForm.product === 'fastrack' ? 1 : 3
                    const d = new Date()
                    d.setMonth(d.getMonth() + months)
                    const today = new Date().toISOString().split('T')[0]
                    setProfileForm(f => ({ ...f, active_until: d.toISOString().split('T')[0], start_date: today }))
                  }}
                  className="mt-1.5 text-xs text-[#2232dd] hover:underline cursor-pointer">
                  ↺ Auto-set aktif sampai ({profileForm.product === 'fastrack' ? '+1 bulan' : '+3 bulan'} dari hari ini)
                </button>
              )}
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

      {/* Written Feedback */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-[#1E1B4B] text-base">Written Feedback</h2>
              <p className="text-[#9CA3AF] text-xs mt-0.5">Saran & arahan dari mentor — bisa diunduh oleh klien</p>
            </div>
            <button onClick={openAddFeedback}
              className="flex items-center gap-2 bg-[#2232dd] text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#1a28b8] transition-colors cursor-pointer">
              <Plus size={13} /> Tambah Feedback
            </button>
          </div>

          {feedbacks.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[#9CA3AF] text-sm">Belum ada feedback. Tambahkan feedback pertama.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {feedbacks.map(f => (
                <div key={f.id} className="px-6 py-4 flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${f.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-[#eff6ff] text-[#2232dd]'}`}>
                    {f.type === 'pdf' ? <FileText size={16} /> : <Video size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-[#1E1B4B] text-sm">{f.title}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.type === 'pdf' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20'}`}>
                        {f.type === 'pdf' ? 'PDF' : 'Video'}
                      </span>
                      {f.session_number && (
                        <span className="text-xs text-[#9CA3AF]">· Sesi {f.session_number}</span>
                      )}
                    </div>
                    {f.description && <p className="text-[#6B6B8A] text-xs mb-1">{f.description}</p>}
                    <a href={f.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#2232dd] hover:underline">
                      <ExternalLink size={11} />
                      {f.type === 'pdf' ? 'Download PDF' : 'Buka Video'}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => openEditFeedback(f)}
                      className="p-1.5 rounded-lg hover:bg-[#eff6ff] text-[#9CA3AF] hover:text-[#2232dd] transition-colors cursor-pointer">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDeleteFeedback(f.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Submissions */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#1E1B4B] text-base">Pengumpulan Tugas</h2>
            <p className="text-[#9CA3AF] text-xs mt-0.5">Tugas yang sudah dikumpulkan oleh klien</p>
          </div>
          {submissions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[#9CA3AF] text-sm">Belum ada tugas yang dikumpulkan.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {submissions.map(s => {
                const st = STATUS_LABEL[s.status] ?? STATUS_LABEL.submitted
                return (
                  <div key={s.id} className="px-6 py-4 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-[#eff6ff] text-[#2232dd] flex items-center justify-center flex-shrink-0">
                      <ClipboardList size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="font-semibold text-[#1E1B4B] text-sm">{s.task?.title ?? 'Tugas'}</p>
                        {s.task?.week_number && (
                          <span className="text-xs text-[#9CA3AF]">· Minggu {s.task.week_number}</span>
                        )}
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border`}
                          style={{ color: st.color, background: st.bg }}>
                          {st.label}
                        </span>
                      </div>
                      <a href={s.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#2232dd] hover:underline mb-1">
                        <ExternalLink size={11} /> Lihat file
                      </a>
                      {s.notes && <p className="text-[#6B6B8A] text-xs">{s.notes}</p>}
                      {s.mentor_feedback && (
                        <p className="text-xs mt-1 bg-[#f4f8ff] border border-[#2232dd]/10 rounded-lg px-2.5 py-1.5 text-[#6B6B8A]">
                          Feedback: {s.mentor_feedback}
                        </p>
                      )}
                      <p className="text-[#9CA3AF] text-xs mt-1">
                        Dikumpulkan {new Date(s.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <button onClick={() => openReview(s)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-[#6B6B8A] text-xs font-medium hover:bg-[#eff6ff] hover:text-[#2232dd] hover:border-[#2232dd]/20 transition-colors cursor-pointer flex-shrink-0">
                      <RotateCcw size={12} /> Review
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">Review Tugas</h2>
              <button onClick={() => setReviewModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={16} className="text-[#9CA3AF]" />
              </button>
            </div>
            <form onSubmit={handleReviewSave} className="p-6 flex flex-col gap-4">
              {reviewError && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{reviewError}</p>}
              <div>
                <p className="text-xs font-semibold text-[#1E1B4B] mb-1">{reviewModal.task?.title}</p>
                <a href={reviewModal.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#2232dd] hover:underline">
                  <ExternalLink size={11} /> Buka file submission
                </a>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Status</label>
                <select value={reviewForm.status} onChange={e => setReviewForm(f => ({ ...f, status: e.target.value as 'reviewed' | 'revision' }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all bg-white cursor-pointer">
                  <option value="reviewed">✅ Disetujui</option>
                  <option value="revision">🔄 Perlu Revisi</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Feedback untuk Klien (opsional)</label>
                <textarea value={reviewForm.mentor_feedback} rows={3}
                  placeholder="Tulis catatan atau arahan revisi..."
                  onChange={e => setReviewForm(f => ({ ...f, mentor_feedback: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setReviewModal(null)}
                  className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={reviewPending}
                  className="flex-1 bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  {reviewPending ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">
                {feedbackModal === 'add' ? 'Tambah Feedback' : 'Edit Feedback'}
              </h2>
              <button onClick={() => setFeedbackModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={16} className="text-[#9CA3AF]" />
              </button>
            </div>
            <form onSubmit={handleFeedbackSave} className="p-6 flex flex-col gap-4">
              {feedbackError && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{feedbackError}</p>}
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Judul</label>
                <input required value={feedbackForm.title} placeholder="Contoh: Feedback Bab 3"
                  onChange={e => setFeedbackForm(f => ({ ...f, title: e.target.value }))} className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Deskripsi (opsional)</label>
                <textarea value={feedbackForm.description} rows={2} placeholder="Catatan singkat..."
                  onChange={e => setFeedbackForm(f => ({ ...f, description: e.target.value }))}
                  className={INPUT + ' resize-none'} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Tipe</label>
                  <select value={feedbackForm.type} onChange={e => setFeedbackForm(f => ({ ...f, type: e.target.value as 'pdf' | 'video' }))} className={SELECT}>
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">No. Sesi (opsional)</label>
                  <input type="number" min={1} value={feedbackForm.session_number ?? ''}
                    placeholder="—"
                    onChange={e => setFeedbackForm(f => ({ ...f, session_number: e.target.value ? Number(e.target.value) : null }))}
                    className={INPUT} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">
                  {feedbackForm.type === 'pdf' ? 'Link PDF (Google Drive / Dropbox / dll)' : 'Link Video (YouTube / dll)'}
                </label>
                <input required value={feedbackForm.url} placeholder="https://..."
                  onChange={e => setFeedbackForm(f => ({ ...f, url: e.target.value }))} className={INPUT} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setFeedbackModal(null)}
                  className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={feedbackPending}
                  className="flex-1 bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  {feedbackPending ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
