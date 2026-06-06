'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, X, Loader2, Trash2, UserCheck, Users, ChevronRight, AlertTriangle } from 'lucide-react'
import { createMentorAction, deleteMentorAction } from '@/app/(admin)/admin/actions'

const INPUT = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all'

interface Mentor {
  id: string
  full_name: string
  phone: string
  email: string
  avatar_url: string | null
  clientCount: number
}

interface Props { mentors: Mentor[] }

export default function MentorsTable({ mentors }: Props) {
  const router = useRouter()
  const [showModal, setShowModal]       = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [error, setError]               = useState('')
  const [isPending, startTransition]    = useTransition()
  const [form, setForm] = useState({ email: '', full_name: '', phone: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await createMentorAction(form)
      if (res.error) { setError(res.error); return }
      setShowModal(false)
      setForm({ email: '', full_name: '', phone: '' })
      router.refresh()
    })
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    startTransition(async () => {
      await deleteMentorAction(deleteTarget.id)
      setDeleteTarget(null)
      router.refresh()
    })
  }

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#2232dd] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] transition-colors cursor-pointer">
          <Plus size={15} /> Tambah Mentor
        </button>
      </div>

      {mentors.length === 0 ? (
        <div className="bg-white rounded-2xl p-14 text-center border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
            <UserCheck size={24} className="text-[#2232dd]" />
          </div>
          <p className="font-semibold text-[#1E1B4B] text-sm mb-1">Belum ada mentor</p>
          <p className="text-[#9CA3AF] text-xs">Tambah mentor pertama untuk mulai assign klien</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider">Nama</th>
                  <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider">Klien</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mentors.map((m, i) => (
                  <tr key={m.id}
                    onClick={() => router.push(`/admin/mentors/${m.id}`)}
                    className="hover:bg-[#f4f8ff]/60 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5 text-[#9CA3AF] text-xs">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {m.avatar_url ? (
                          <Image src={m.avatar_url} alt={m.full_name} width={32} height={32}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C6FCD] to-[#2232dd] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {m.full_name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#1E1B4B]">{m.full_name}</p>
                          <p className="text-[#9CA3AF] text-xs">{m.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#6B6B8A] hidden md:table-cell">{m.email}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-[#1E1B4B]">
                        <Users size={13} className="text-[#9CA3AF]" />
                        {m.clientCount}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 flex items-center gap-2 justify-end">
                      <button onClick={e => { e.stopPropagation(); setDeleteTarget({ id: m.id, name: m.full_name }) }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                      <ChevronRight size={14} className="text-[#9CA3AF]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-50">
            <p className="text-[#9CA3AF] text-xs">{mentors.length} mentor terdaftar</p>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div>
                <h2 className="font-bold text-[#1E1B4B] text-base mb-1">Hapus Mentor?</h2>
                <p className="text-[#6B6B8A] text-sm">
                  Akun <span className="font-semibold text-[#1E1B4B]">{deleteTarget.name}</span> akan dihapus permanen beserta semua aksesnya. Mereka harus daftar ulang untuk bisa masuk lagi.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setDeleteTarget(null)} disabled={isPending}
                className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60">
                Batal
              </button>
              <button onClick={handleDelete} disabled={isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                {isPending ? <><Loader2 size={14} className="animate-spin" /> Menghapus...</> : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">Tambah Mentor</h2>
              <button onClick={() => { setShowModal(false); setError('') }}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={16} className="text-[#9CA3AF]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Email</label>
                <input required type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="mentor@email.com" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Nama Lengkap</label>
                <input required value={form.full_name}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="Nama mentor" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">No. HP</label>
                <input required value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="08xxx" className={INPUT} />
              </div>
              <p className="text-[#9CA3AF] text-xs">Email set password otomatis dikirim ke mentor setelah akun dibuat.</p>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowModal(false); setError('') }}
                  className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={isPending}
                  className="flex-1 bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  {isPending ? <><Loader2 size={14} className="animate-spin" /> Membuat...</> : 'Buat Akun Mentor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
