'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardList, ExternalLink, FileText, Video, Plus, X, Loader2, Pencil, Trash2, RotateCcw } from 'lucide-react'
import {
  reviewSubmissionAction,
  createFeedbackAction,
  updateFeedbackAction,
  deleteFeedbackAction,
} from '@/app/(admin)/admin/actions'
import type { Profile, TaskSubmission, Feedback } from '@/types'

const INPUT = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all'
const SELECT = INPUT + ' bg-white cursor-pointer'

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Dikumpulkan', color: '#2232dd', bg: '#eff6ff' },
  reviewed:  { label: 'Disetujui',   color: '#16a34a', bg: '#f0fdf4' },
  revision:  { label: 'Revisi',      color: '#ea580c', bg: '#fff7ed' },
}

const EMPTY_FEEDBACK = { title: '', description: '', type: 'pdf' as 'pdf' | 'video', url: '', session_number: null as number | null }

interface Props {
  clientId: string
  clientProfile: Profile
  submissions: TaskSubmission[]
  feedbacks: Feedback[]
}

export default function MentorReviewClient({ clientId, submissions, feedbacks }: Props) {
  const router = useRouter()

  // Review
  const [reviewModal, setReviewModal] = useState<TaskSubmission | null>(null)
  const [reviewForm, setReviewForm]   = useState({ status: 'reviewed' as 'reviewed' | 'revision', mentor_feedback: '' })
  const [reviewError, setReviewError] = useState('')
  const [reviewPending, startReviewTransition] = useTransition()

  const openReview = (s: TaskSubmission) => {
    setReviewForm({ status: s.status === 'revision' ? 'revision' : 'reviewed', mentor_feedback: s.mentor_feedback ?? '' })
    setReviewError('')
    setReviewModal(s)
  }

  const handleReviewSave = (e: React.FormEvent) => {
    e.preventDefault()
    startReviewTransition(async () => {
      const res = await reviewSubmissionAction(reviewModal!.id, clientId, reviewForm)
      if (res.error) { setReviewError(res.error); return }
      setReviewModal(null)
      router.refresh()
    })
  }

  // Feedback
  const [feedbackModal, setFeedbackModal] = useState<'add' | string | null>(null)
  const [feedbackForm, setFeedbackForm]   = useState(EMPTY_FEEDBACK)
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackPending, startFeedbackTransition] = useTransition()

  const openAddFeedback = () => { setFeedbackForm(EMPTY_FEEDBACK); setFeedbackError(''); setFeedbackModal('add') }
  const openEditFeedback = (f: Feedback) => {
    setFeedbackForm({ title: f.title, description: f.description, type: f.type, url: f.url, session_number: f.session_number })
    setFeedbackError('')
    setFeedbackModal(f.id)
  }

  const handleFeedbackSave = (e: React.FormEvent) => {
    e.preventDefault()
    startFeedbackTransition(async () => {
      const res = feedbackModal === 'add'
        ? await createFeedbackAction({ ...feedbackForm, user_id: clientId })
        : await updateFeedbackAction(feedbackModal!, clientId, feedbackForm)
      if (res.error) { setFeedbackError(res.error); return }
      setFeedbackModal(null)
      router.refresh()
    })
  }

  const handleDeleteFeedback = (id: string) => {
    if (!confirm('Hapus feedback ini?')) return
    startFeedbackTransition(async () => { await deleteFeedbackAction(id, clientId); router.refresh() })
  }

  return (
    <>
      {/* Task Submissions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#1E1B4B] text-base">Pengumpulan Tugas</h2>
          <p className="text-[#9CA3AF] text-xs mt-0.5">Review dan berikan feedback untuk setiap tugas</p>
        </div>
        {submissions.length === 0 ? (
          <p className="text-center text-[#9CA3AF] text-sm py-10">Belum ada tugas yang dikumpulkan</p>
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
                      {s.task?.week_number && <span className="text-xs text-[#9CA3AF]">· Minggu {s.task.week_number}</span>}
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                        style={{ color: st.color, background: st.bg }}>{st.label}</span>
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

      {/* Written Feedback */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-[#1E1B4B] text-base">Written Feedback</h2>
            <p className="text-[#9CA3AF] text-xs mt-0.5">Saran & arahan untuk klien</p>
          </div>
          <button onClick={openAddFeedback}
            className="flex items-center gap-2 bg-[#2232dd] text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#1a28b8] transition-colors cursor-pointer">
            <Plus size={13} /> Tambah
          </button>
        </div>
        {feedbacks.length === 0 ? (
          <p className="text-center text-[#9CA3AF] text-sm py-10">Belum ada written feedback</p>
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
                    {f.session_number && <span className="text-xs text-[#9CA3AF]">· Sesi {f.session_number}</span>}
                  </div>
                  {f.description && <p className="text-[#6B6B8A] text-xs mb-1">{f.description}</p>}
                  <a href={f.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#2232dd] hover:underline">
                    <ExternalLink size={11} /> {f.type === 'pdf' ? 'Download PDF' : 'Buka Video'}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => openEditFeedback(f)} className="p-1.5 rounded-lg hover:bg-[#eff6ff] text-[#9CA3AF] hover:text-[#2232dd] transition-colors cursor-pointer">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDeleteFeedback(f.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors cursor-pointer">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">Review Tugas</h2>
              <button onClick={() => setReviewModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"><X size={16} className="text-[#9CA3AF]" /></button>
            </div>
            <form onSubmit={handleReviewSave} className="p-6 flex flex-col gap-4">
              {reviewError && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{reviewError}</p>}
              <div>
                <p className="text-xs font-semibold text-[#1E1B4B] mb-1">{reviewModal.task?.title}</p>
                <a href={reviewModal.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#2232dd] hover:underline">
                  <ExternalLink size={11} /> Buka file submission
                </a>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Status</label>
                <select value={reviewForm.status} onChange={e => setReviewForm(f => ({ ...f, status: e.target.value as 'reviewed' | 'revision' }))} className={SELECT}>
                  <option value="reviewed">✅ Disetujui</option>
                  <option value="revision">🔄 Perlu Revisi</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Feedback (opsional)</label>
                <textarea value={reviewForm.mentor_feedback} rows={3} placeholder="Catatan atau arahan revisi..."
                  onChange={e => setReviewForm(f => ({ ...f, mentor_feedback: e.target.value }))}
                  className={INPUT + ' resize-none'} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setReviewModal(null)} className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={reviewPending} className="flex-1 bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
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
              <h2 className="font-bold text-[#1E1B4B] text-base">{feedbackModal === 'add' ? 'Tambah Feedback' : 'Edit Feedback'}</h2>
              <button onClick={() => setFeedbackModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"><X size={16} className="text-[#9CA3AF]" /></button>
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
                <textarea value={feedbackForm.description} rows={2}
                  onChange={e => setFeedbackForm(f => ({ ...f, description: e.target.value }))} className={INPUT + ' resize-none'} />
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
                    onChange={e => setFeedbackForm(f => ({ ...f, session_number: e.target.value ? Number(e.target.value) : null }))} className={INPUT} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">
                  {feedbackForm.type === 'pdf' ? 'Link PDF (Google Drive)' : 'Link Video (YouTube)'}
                </label>
                <input required value={feedbackForm.url} placeholder="https://..."
                  onChange={e => setFeedbackForm(f => ({ ...f, url: e.target.value }))} className={INPUT} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setFeedbackModal(null)} className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={feedbackPending} className="flex-1 bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  {feedbackPending ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
