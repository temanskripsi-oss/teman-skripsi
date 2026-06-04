'use client'
import { useState, useTransition } from 'react'
import { ClipboardList, ExternalLink, CheckCircle, RotateCcw, Clock, X, Loader2 } from 'lucide-react'
import { submitTaskAction } from '@/app/(dashboard)/dashboard/actions'
import type { Task, TaskSubmission } from '@/types'

const STATUS = {
  submitted: { label: 'Dikumpulkan', icon: Clock,       color: 'text-[#2232dd]', bg: 'bg-[#eff6ff]', border: 'border-[#2232dd]/20' },
  reviewed:  { label: 'Disetujui',   icon: CheckCircle, color: 'text-[#16a34a]', bg: 'bg-green-50',  border: 'border-green-100' },
  revision:  { label: 'Revisi',      icon: RotateCcw,   color: 'text-[#ea580c]', bg: 'bg-orange-50', border: 'border-orange-100' },
} as const

function getDeadlineInfo(startDate: string | null, weekNumber: number) {
  if (!startDate) return null
  const start = new Date(startDate)
  const deadline = new Date(start)
  deadline.setDate(deadline.getDate() + weekNumber * 7 - 1)

  const now = new Date()
  now.setHours(0, 0, 0, 0)
  deadline.setHours(0, 0, 0, 0)

  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const label = deadline.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

  if (diffDays < 0) return { label, status: 'overdue',  text: `Terlambat ${Math.abs(diffDays)} hari`,  color: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-100' }
  if (diffDays === 0) return { label, status: 'today',   text: 'Deadline hari ini!',                   color: 'text-orange-500',  bg: 'bg-orange-50',  border: 'border-orange-100' }
  return            { label, status: 'upcoming', text: `${diffDays} hari lagi`,                        color: 'text-[#2232dd]',   bg: 'bg-[#eff6ff]',  border: 'border-[#2232dd]/20' }
}

interface Props {
  tasks: Task[]
  submissionsMap: Record<string, TaskSubmission>
  startDate: string | null
}

export default function TasksClient({ tasks, submissionsMap: initialMap, startDate }: Props) {
  const [submissionsMap, setSubmissionsMap] = useState(initialMap)
  const [modal, setModal] = useState<Task | null>(null)
  const [form, setForm] = useState({ url: '', notes: '' })
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const weeks = [...new Set(tasks.map(t => t.week_number))].sort((a, b) => a - b)
  const grouped: Record<number, Task[]> = {}
  tasks.forEach(t => {
    if (!grouped[t.week_number]) grouped[t.week_number] = []
    grouped[t.week_number].push(t)
  })

  const openSubmit = (task: Task) => {
    const existing = submissionsMap[task.id]
    setForm({ url: existing?.url ?? '', notes: existing?.notes ?? '' })
    setError('')
    setModal(task)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await submitTaskAction(modal!.id, form)
      if (res.error) { setError(res.error); return }
      setSubmissionsMap(prev => ({
        ...prev,
        [modal!.id]: {
          ...prev[modal!.id],
          task_id: modal!.id,
          url: form.url,
          notes: form.notes,
          status: 'submitted',
        } as TaskSubmission,
      }))
      setModal(null)
    })
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-14 text-center border border-gray-100 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
          <ClipboardList size={22} className="text-[#2232dd]" />
        </div>
        <p className="font-semibold text-[#1E1B4B] text-sm mb-1">Belum ada tugas</p>
        <p className="text-[#9CA3AF] text-xs">Tugas mingguan akan ditambahkan oleh mentor</p>
      </div>
    )
  }

  const weekDeadlines = Object.fromEntries(weeks.map(w => [w, getDeadlineInfo(startDate, w)]))

  return (
    <>
      <div className="flex flex-col gap-8">
        {weeks.map(week => (
          <div key={week}>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20 text-xs font-bold px-3 py-1.5 rounded-full">
                Minggu {week}
              </span>
              {weekDeadlines[week] && (
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${weekDeadlines[week]!.color} ${weekDeadlines[week]!.bg} ${weekDeadlines[week]!.border}`}>
                  <Clock size={11} />
                  Deadline {weekDeadlines[week]!.label} · {weekDeadlines[week]!.text}
                </span>
              )}
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="flex flex-col gap-3">
              {(grouped[week] ?? []).sort((a, b) => a.order_index - b.order_index).map(task => {
                const sub = submissionsMap[task.id]
                const st = sub ? STATUS[sub.status] : null
                const StatusIcon = st?.icon
                return (
                  <div key={task.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#eff6ff] text-[#2232dd] flex items-center justify-center flex-shrink-0">
                        <ClipboardList size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-[#1E1B4B] text-sm leading-snug">{task.title}</p>
                          {st && StatusIcon && (
                            <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${st.color} ${st.bg} ${st.border}`}>
                              <StatusIcon size={10} /> {st.label}
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-[#6B6B8A] text-xs leading-relaxed mt-0.5">{task.description}</p>
                        )}
                        {sub && (
                          <div className="mt-2 space-y-1.5">
                            <a href={sub.url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#2232dd] hover:underline">
                              <ExternalLink size={11} /> Lihat file yang dikumpulkan
                            </a>
                            {sub.mentor_feedback && (
                              <div className="bg-[#f4f8ff] border border-[#2232dd]/10 rounded-xl px-3 py-2">
                                <p className="text-xs font-semibold text-[#2232dd] mb-0.5">Feedback Mentor:</p>
                                <p className="text-xs text-[#6B6B8A]">{sub.mentor_feedback}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <button onClick={() => openSubmit(task)}
                      className={`mt-3 w-full py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        sub?.status === 'reviewed'
                          ? 'bg-green-50 text-green-600 border border-green-100 cursor-default'
                          : 'bg-[#2232dd] text-white hover:bg-[#1a28b8]'
                      }`}>
                      {sub ? (sub.status === 'reviewed' ? '✓ Selesai' : 'Ubah Submission') : 'Kumpulkan Tugas'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">Kumpulkan Tugas</h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={16} className="text-[#9CA3AF]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="bg-[#f4f8ff] rounded-xl px-4 py-3 border border-[#2232dd]/10">
                <p className="font-semibold text-[#1E1B4B] text-sm">{modal.title}</p>
                {modal.description && <p className="text-[#6B6B8A] text-xs mt-0.5">{modal.description}</p>}
              </div>
              {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>}
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Link Google Drive / File</label>
                <input required value={form.url} placeholder="https://drive.google.com/..."
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Catatan (opsional)</label>
                <textarea value={form.notes} rows={2} placeholder="Tulis catatan untuk mentor..."
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModal(null)}
                  className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={isPending}
                  className="flex-1 bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  {isPending ? <><Loader2 size={14} className="animate-spin" /> Mengumpulkan...</> : 'Kumpulkan Tugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
