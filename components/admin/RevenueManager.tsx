'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2, Trash2, CheckCircle, Clock } from 'lucide-react'
import {
  createPaymentAction,
  updatePaymentStatusAction,
  deletePaymentAction,
} from '@/app/(admin)/admin/actions'
import type { Payment, Profile } from '@/types'

const INPUT = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all'
const SELECT = INPUT + ' bg-white cursor-pointer'

interface Props {
  payments: (Payment & { profiles: Pick<Profile, 'id' | 'full_name' | 'product'> | null })[]
  clients: Pick<Profile, 'id' | 'full_name' | 'product'>[]
  stats: { total: number; thisMonth: number; pending: number }
}

export default function RevenueManager({ payments, clients, stats }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    user_id: '',
    amount: '',
    description: '',
    payment_date: new Date().toISOString().split('T')[0],
    status: 'paid' as 'paid' | 'pending',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await createPaymentAction({ ...form, amount: Number(form.amount) })
      if (res.error) { setError(res.error); return }
      setShowModal(false)
      setForm({ user_id: '', amount: '', description: '', payment_date: new Date().toISOString().split('T')[0], status: 'paid' })
      router.refresh()
    })
  }

  const handleToggleStatus = (id: string, current: 'paid' | 'pending') => {
    startTransition(async () => {
      await updatePaymentStatusAction(id, current === 'paid' ? 'pending' : 'paid')
      router.refresh()
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Hapus data pembayaran ini?')) return
    startTransition(async () => { await deletePaymentAction(id); router.refresh() })
  }

  const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

  const statCards = [
    { label: 'Total Revenue', value: fmt(stats.total), color: '#2232dd', bg: '#eff6ff' },
    { label: 'Bulan Ini', value: fmt(stats.thisMonth), color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Pending', value: fmt(stats.pending), color: '#ea580c', bg: '#fff7ed' },
  ]

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">{s.label}</p>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-[#1E1B4B]">Riwayat Pembayaran</h2>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#2232dd] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] transition-colors cursor-pointer">
          <Plus size={15} /> Catat Pembayaran
        </button>
      </div>

      {/* Payments table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider">Klien</th>
                <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Keterangan</th>
                <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider">Nominal</th>
                <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Tanggal</th>
                <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-[#9CA3AF] py-12 text-sm">Belum ada data pembayaran</td></tr>
              ) : payments.map(p => (
                <tr key={p.id} className="hover:bg-[#f4f8ff]/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-[#1E1B4B]">{p.profiles?.full_name ?? '-'}</p>
                    <p className="text-[#9CA3AF] text-xs capitalize">{p.profiles?.product?.replace('-', ' ')}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[#6B6B8A] hidden md:table-cell">{p.description || '-'}</td>
                  <td className="px-5 py-3.5 font-semibold text-[#1E1B4B]">{fmt(p.amount)}</td>
                  <td className="px-5 py-3.5 text-[#6B6B8A] text-xs hidden sm:table-cell">
                    {new Date(p.payment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleToggleStatus(p.id, p.status as 'paid' | 'pending')}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                        p.status === 'paid' ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100' : 'bg-orange-50 text-orange-500 border-orange-100 hover:bg-orange-100'
                      }`}>
                      {p.status === 'paid' ? <CheckCircle size={11} /> : <Clock size={11} />}
                      {p.status === 'paid' ? 'Lunas' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">Catat Pembayaran</h2>
              <button onClick={() => { setShowModal(false); setError('') }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={16} className="text-[#9CA3AF]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>}
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Klien</label>
                <select required value={form.user_id} onChange={e => setForm(f => ({ ...f, user_id: e.target.value }))} className={SELECT}>
                  <option value="">Pilih klien...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Nominal (Rp)</label>
                <input required type="number" min={0} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="500000" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Keterangan</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="DP Fastrack, Pelunasan, dll" className={INPUT} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Tanggal</label>
                  <input required type="date" value={form.payment_date} onChange={e => setForm(f => ({ ...f, payment_date: e.target.value }))} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'paid' | 'pending' }))} className={SELECT}>
                    <option value="paid">Lunas</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowModal(false); setError('') }}
                  className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={isPending}
                  className="flex-1 bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  {isPending ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
