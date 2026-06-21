'use client'
import { useState, useEffect, useCallback } from 'react'
import { getBatchLabel } from '@/lib/mayar'
import type { Registration } from '@/types'
import { Users, Clock, CheckCircle, XCircle, Loader2, Trash2 } from 'lucide-react'

const STATUS_CONFIG = {
  pending: { label: 'Menunggu Bayar', color: 'text-orange-500',  bg: 'bg-orange-50',  border: 'border-orange-100' },
  paid:    { label: 'Sudah Bayar',    color: 'text-[#2232dd]',   bg: 'bg-[#eff6ff]',  border: 'border-[#2232dd]/20' },
  active:  { label: 'Aktif',          color: 'text-[#16a34a]',   bg: 'bg-green-50',   border: 'border-green-100' },
  expired: { label: 'Expired',        color: 'text-[#9CA3AF]',   bg: 'bg-gray-50',    border: 'border-gray-100' },
} as const

export default function AdminRegistrationsPage() {
  const [list, setList] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/admin/registrations')
    const data = await res.json()
    setList(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const activate = async (id: string) => {
    if (!confirm('Aktifkan pendaftar ini? Akun dashboard akan langsung dibuat.')) return
    setActivating(id)
    const res = await fetch('/api/admin/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationId: id }),
    })
    const data = await res.json()
    if (!res.ok) { alert(data.error ?? 'Gagal mengaktifkan'); setActivating(null); return }
    await fetchData()
    setActivating(null)
  }

  const deleteReg = async (id: string, name: string) => {
    if (!confirm(`Hapus permanen data "${name}"? Mereka harus daftar ulang.`)) return
    setDeleting(id)
    await fetch('/api/admin/registrations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationId: id }),
    })
    await fetchData()
    setDeleting(null)
  }

  const stats = {
    total:   list.length,
    paid:    list.filter(r => r.status === 'paid' || r.status === 'active').length,
    pending: list.filter(r => r.status === 'pending').length,
    revenue: list.filter(r => r.status === 'paid' || r.status === 'active').reduce((s, r) => s + r.amount, 0),
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Registrasi</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Pantau dan aktifkan pendaftar</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Daftar',  value: stats.total,   icon: Users,        color: '#2232dd', bg: '#eff6ff' },
          { label: 'Sudah Bayar',   value: stats.paid,    icon: CheckCircle,  color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Menunggu',      value: stats.pending, icon: Clock,        color: '#ea580c', bg: '#fff7ed' },
          { label: 'Total Revenue', value: `Rp ${(stats.revenue/1000).toFixed(0)}rb`, icon: XCircle, color: '#7C6FCD', bg: '#f5f3ff' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: s.bg, color: s.color }}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-lg font-bold text-[#1E1B4B]">{s.value}</p>
                <p className="text-[#9CA3AF] text-xs">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
          <Loader2 size={24} className="animate-spin text-[#9CA3AF] mx-auto" />
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
          <p className="text-[#9CA3AF] text-sm">Belum ada registrasi masuk.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#fafafa]">
                  {['Nama', 'Email', 'No. HP', 'Produk', 'Batch', 'Status', 'Tanggal', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-[#9CA3AF] text-xs font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {list.map(r => {
                  const st = STATUS_CONFIG[r.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending
                  const isActivating = activating === r.id
                  return (
                    <tr key={r.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-[#1E1B4B]">{r.full_name}</td>
                      <td className="px-5 py-3.5 text-[#6B6B8A]">{r.email}</td>
                      <td className="px-5 py-3.5 text-[#6B6B8A]">{r.phone}</td>
                      <td className="px-5 py-3.5 text-[#6B6B8A] text-xs capitalize">{r.product ?? '-'}</td>
                      <td className="px-5 py-3.5">
                        {r.batch ? (
                          <span className="text-xs bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20 px-2.5 py-1 rounded-full font-semibold">
                            {getBatchLabel(r.batch)}
                          </span>
                        ) : (
                          <span className="text-xs text-[#9CA3AF]">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.color} ${st.bg} ${st.border}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#9CA3AF] text-xs">
                        {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {r.status === 'pending' && (
                            <button
                              onClick={() => activate(r.id)}
                              disabled={isActivating}
                              className="flex items-center gap-1.5 text-xs font-semibold bg-[#16a34a] text-white px-3 py-1.5 rounded-lg hover:bg-[#15803d] disabled:opacity-60 transition-colors"
                            >
                              {isActivating ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                              Aktifkan
                            </button>
                          )}
                          <button
                            onClick={() => deleteReg(r.id, r.full_name)}
                            disabled={deleting === r.id}
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-100 disabled:opacity-60 transition-colors"
                          >
                            {deleting === r.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
