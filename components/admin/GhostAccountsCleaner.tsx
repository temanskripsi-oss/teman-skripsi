'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Trash2, Loader2, X } from 'lucide-react'
import { deleteGhostAccountAction } from '@/app/(admin)/admin/actions'

interface Ghost { id: string; email: string; created_at: string }
interface Props { ghosts: Ghost[] }

export default function GhostAccountsCleaner({ ghosts }: Props) {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<Ghost | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (ghost: Ghost) => {
    startTransition(async () => {
      await deleteGhostAccountAction(ghost.id)
      setDeleteTarget(null)
      router.refresh()
    })
  }

  const handleDeleteAll = () => {
    startTransition(async () => {
      for (const ghost of ghosts) {
        await deleteGhostAccountAction(ghost.id)
      }
      setDeleteTarget(null)
      router.refresh()
    })
  }

  return (
    <>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm mb-1">
                {ghosts.length} akun tidak terdaftar ditemukan
              </p>
              <p className="text-amber-700 text-xs mb-3">
                Akun berikut login via Google tapi belum didaftarkan admin. Hapus semua untuk membersihkan.
              </p>
              <div className="flex flex-col gap-1.5">
                {ghosts.map(g => (
                  <div key={g.id} className="flex items-center justify-between gap-3 bg-white/60 rounded-xl px-3 py-2">
                    <span className="text-amber-900 text-xs font-medium">{g.email}</span>
                    <button
                      onClick={() => setDeleteTarget(g)}
                      className="p-1 rounded-lg hover:bg-red-100 text-amber-400 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleDeleteAll}
            disabled={isPending}
            className="flex-shrink-0 flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60">
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            Hapus Semua
          </button>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div>
                <h2 className="font-bold text-[#1E1B4B] text-base mb-1">Hapus Akun?</h2>
                <p className="text-[#6B6B8A] text-sm">
                  Akun <span className="font-semibold text-[#1E1B4B]">{deleteTarget.email}</span> akan dihapus permanen.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setDeleteTarget(null)} disabled={isPending}
                className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60">
                Batal
              </button>
              <button onClick={() => handleDelete(deleteTarget)} disabled={isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                {isPending ? <><Loader2 size={14} className="animate-spin" /> Menghapus...</> : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
