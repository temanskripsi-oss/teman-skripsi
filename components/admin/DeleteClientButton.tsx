'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { deleteClientAction } from '@/app/(admin)/admin/actions'

interface Props { userId: string; name: string }

export default function DeleteClientButton({ userId, name }: Props) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteClientAction(userId)
      router.push('/admin/clients')
    })
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex-shrink-0">
        <Trash2 size={15} /> Hapus Klien
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div>
                <h2 className="font-bold text-[#1E1B4B] text-base mb-1">Hapus Klien?</h2>
                <p className="text-[#6B6B8A] text-sm">
                  Akun <span className="font-semibold text-[#1E1B4B]">{name}</span> akan dihapus permanen beserta semua aksesnya. Mereka harus daftar ulang untuk bisa masuk lagi.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowModal(false)} disabled={isPending}
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
    </>
  )
}
