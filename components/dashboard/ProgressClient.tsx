'use client'
import { useState, useTransition } from 'react'
import { CheckCircle, Clock, RotateCcw, ExternalLink, FileText, Video, X, Loader2, BookOpen } from 'lucide-react'
import { submitSessionAction } from '@/app/(dashboard)/dashboard/actions'
import type { Session, SessionSubmission, Feedback } from '@/types'

const STATUS_CONFIG = {
  submitted:  { label: 'Dikirim',    icon: Clock,        color: 'text-[#2232dd]',  bg: 'bg-[#eff6ff]',  border: 'border-[#2232dd]/20' },
  disetujui:  { label: 'Disetujui',  icon: CheckCircle,  color: 'text-[#16a34a]',  bg: 'bg-green-50',   border: 'border-green-100' },
  revisi:     { label: 'Revisi',     icon: RotateCcw,    color: 'text-[#ea580c]',  bg: 'bg-orange-50',  border: 'border-orange-100' },
} as const

interface Props {
  sessions: Session[]
  subsMap: Record<string, SessionSubmission>
  feedbacksBySession: Record<number, Feedback[]>
  userId: string
}

export default function ProgressClient({ sessions, subsMap: initialMap, feedbacksBySession }: Props) {
  const [subsMap, setSubsMap] = useState(initialMap)
  const [modal, setModal]     = useState<Session | null>(null)
  const [form, setForm]       = useState({ url: '', notes: '' })
  const [error, setError]     = useState('')
  const [isPending, startTransition] = useTransition()

  const openSubmit = (s: Session) => {
    const existing = subsMap[s.id]
    setForm({ url: existing?.url ?? '', notes: existing?.notes ?? '' })
    setError('')
    setModal(s)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await submitSessionAction(modal!.id, form)
      if (res.error) { setError(res.error); return }
      setSubsMap(prev => ({
        ...prev,
        [modal!.id]: { ...prev[modal!.id], session_id: modal!.id, url: form.url, notes: form.notes, status: 'submitted' } as SessionSubmission,
      }))
      setModal(null)
    })
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-14 text-center border border-gray-100 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
          <BookOpen size={22} className="text-[#2232dd]" />
        </div>
        <p className="font-semibold text-[#1E1B4B] text-sm mb-1">Belum ada sesi</p>
        <p className="text-[#9CA3AF] text-xs">Sesi bimbingan akan muncul setelah dijadwalkan oleh mentor</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {sessions.map(s => {
          const sub        = subsMap[s.id]
          const st         = sub ? STATUS_CONFIG[sub.status] : null
          const StatusIcon = st?.icon
          const docFeedbacks = feedbacksBySession[s.session_number] ?? []
          const hasPR      = !!s.pr_description
          const isDone     = s.status === 'done'

          return (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Session header */}
              <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-50">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  isDone ? 'bg-green-50 text-[#16a34a]' : 'bg-[#eff6ff] text-[#2232dd]'
                }`}>
                  {s.session_number}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1E1B4B] text-sm">
                    Sesi {s.session_number} — {s.session_type === 'online' ? 'Online' : 'Offline'}
                  </p>
                  <p className="text-[#9CA3AF] text-xs">
                    {s.scheduled_at
                      ? new Date(s.scheduled_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                      : 'Belum dijadwalkan'}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${
                  isDone ? 'bg-green-50 text-[#16a34a] border-green-100' : 'bg-[#eff6ff] text-[#2232dd] border-[#2232dd]/20'
                }`}>
                  {isDone ? '✓ Selesai' : 'Upcoming'}
                </span>
              </div>

              <div className="px-5 py-4 flex flex-col gap-3">
                {/* Catatan sesi */}
                {s.catatan_sesi && (
                  <div className="bg-[#f4f8ff] rounded-xl px-4 py-3 border border-[#2232dd]/10">
                    <p className="text-xs font-semibold text-[#2232dd] mb-1">📝 Catatan Sesi</p>
                    <p className="text-sm text-[#1E1B4B] whitespace-pre-wrap leading-relaxed">{s.catatan_sesi}</p>
                  </div>
                )}

                {/* PR */}
                {hasPR && (
                  <div className="bg-orange-50 rounded-xl px-4 py-3 border border-orange-100">
                    <p className="text-xs font-semibold text-orange-600 mb-1">📋 PR dari Mentor</p>
                    <p className="text-sm text-[#1E1B4B] whitespace-pre-wrap leading-relaxed">{s.pr_description}</p>
                  </div>
                )}

                {/* Submission */}
                {hasPR && isDone && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      {sub ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          {st && StatusIcon && (
                            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${st.color} ${st.bg} ${st.border}`}>
                              <StatusIcon size={11} /> {st.label}
                            </span>
                          )}
                          <a href={sub.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-[#2232dd] hover:underline">
                            <ExternalLink size={11} /> Lihat file
                          </a>
                          {sub.mentor_feedback && (
                            <div className="w-full mt-1 bg-white border border-gray-100 rounded-xl px-3 py-2">
                              <p className="text-xs font-semibold text-[#7C6FCD] mb-0.5">Feedback Mentor:</p>
                              <p className="text-xs text-[#6B6B8A]">{sub.mentor_feedback}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-[#9CA3AF]">Belum submit PR</p>
                      )}
                    </div>
                    <button onClick={() => openSubmit(s)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        sub?.status === 'disetujui'
                          ? 'bg-green-50 text-green-600 border border-green-100 cursor-default'
                          : 'bg-[#2232dd] text-white hover:bg-[#1a28b8]'
                      }`}>
                      {sub ? (sub.status === 'disetujui' ? '✓ Selesai' : 'Update') : 'Submit PR'}
                    </button>
                  </div>
                )}

                {/* Feedback docs */}
                {docFeedbacks.length > 0 && (
                  <div className="flex flex-col gap-2 pt-1">
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Dokumen Feedback</p>
                    {docFeedbacks.map(f => (
                      <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2.5 hover:border-[#2232dd]/20 hover:shadow-sm transition-all">
                        <div className={`p-1.5 rounded-lg flex-shrink-0 ${f.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-[#eff6ff] text-[#2232dd]'}`}>
                          {f.type === 'pdf' ? <FileText size={13} /> : <Video size={13} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1E1B4B] truncate">{f.title}</p>
                          {f.description && <p className="text-xs text-[#9CA3AF] truncate">{f.description}</p>}
                        </div>
                        <ExternalLink size={13} className="text-[#9CA3AF] flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                )}

                {!s.catatan_sesi && !hasPR && docFeedbacks.length === 0 && (
                  <p className="text-xs text-[#9CA3AF] italic">Catatan dan PR akan ditambahkan setelah sesi selesai.</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Submit modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">Submit PR Sesi {modal.session_number}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                <X size={16} className="text-[#9CA3AF]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {modal.pr_description && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-orange-600 mb-1">PR dari Mentor</p>
                  <p className="text-xs text-[#1E1B4B]">{modal.pr_description}</p>
                </div>
              )}
              {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>}
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Link Google Drive</label>
                <input required value={form.url} placeholder="https://drive.google.com/..."
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Catatan (opsional)</label>
                <textarea value={form.notes} rows={2} placeholder="Tulis catatan untuk mentor..."
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModal(null)}
                  className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={isPending}
                  className="flex-1 bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2">
                  {isPending ? <><Loader2 size={14} className="animate-spin" /> Mengirim...</> : 'Submit PR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
