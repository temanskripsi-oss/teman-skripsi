'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, X, Loader2, ChevronRight } from 'lucide-react'
import { createClientAction, sendPasswordResetAction } from '@/app/(admin)/admin/actions'
import type { Profile, Product } from '@/types'

const PRODUCTS: { value: Product | 'all-filter'; label: string }[] = [
  { value: 'all-filter', label: 'Semua Produk' },
  { value: 'fastrack', label: 'Fastrack' },
  { value: 'mentoring-sempro', label: 'Mentoring Sempro' },
  { value: 'mentoring-penelitian', label: 'Mentoring Penelitian' },
  { value: 'all', label: 'All Access' },
]

const PRODUCT_LABELS: Record<string, string> = {
  fastrack: 'Fastrack',
  'mentoring-sempro': 'Sempro',
  'mentoring-penelitian': 'Penelitian',
  all: 'All Access',
}

const INPUT = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all'
const SELECT = INPUT + ' bg-white cursor-pointer'

interface Props { clients: Profile[] }

export default function ClientsTable({ clients }: Props) {
  const router = useRouter()
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState<string>('all-filter')
  const [showModal, setShowModal] = useState(false)
  const [error, setError]         = useState('')
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    email: '', full_name: '', university: '', phone: '',
    product: 'fastrack', active_until: '',
  })

  const filtered = clients.filter(c => {
    const matchSearch = c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.university?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all-filter' || c.product === filter
    return matchSearch && matchFilter
  })

  const isExpired = (date: string) => date && new Date(date) < new Date()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await createClientAction(form)
      if (res.error) { setError(res.error); return }
      await sendPasswordResetAction(form.email)
      setShowModal(false)
      setForm({ email: '', full_name: '', university: '', phone: '', product: 'fastrack', active_until: '' })
      router.refresh()
    })
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau universitas..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all cursor-pointer">
          {PRODUCTS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#2232dd] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] transition-colors cursor-pointer flex-shrink-0">
          <Plus size={15} /> Tambah Klien
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider">#</th>
                <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider">Nama</th>
                <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Universitas</th>
                <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider">Produk</th>
                <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Aktif Sampai</th>
                <th className="text-left px-5 py-3.5 text-[#9CA3AF] font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-[#9CA3AF] py-12 text-sm">Tidak ada klien ditemukan</td></tr>
              ) : filtered.map((c, i) => {
                const expired = isExpired(c.active_until)
                return (
                  <tr key={c.id} className="hover:bg-[#f4f8ff]/60 transition-colors">
                    <td className="px-5 py-3.5 text-[#9CA3AF] text-xs">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.full_name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1E1B4B]">{c.full_name}</p>
                          <p className="text-[#9CA3AF] text-xs hidden sm:block">{c.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#6B6B8A] hidden md:table-cell">{c.university}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20 px-2.5 py-1 rounded-full font-medium">
                        {PRODUCT_LABELS[c.product] ?? c.product}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#6B6B8A] text-xs hidden sm:table-cell">
                      {c.active_until ? new Date(c.active_until).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${expired ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                        {expired ? 'Expired' : 'Aktif'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/clients/${c.id}`}
                        className="flex items-center gap-1 text-[#2232dd] text-xs font-medium hover:underline cursor-pointer">
                        Detail <ChevronRight size={13} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-50">
          <p className="text-[#9CA3AF] text-xs">{filtered.length} dari {clients.length} klien</p>
        </div>
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">Tambah Klien Baru</h2>
              <button onClick={() => { setShowModal(false); setError('') }}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={16} className="text-[#9CA3AF]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="klien@email.com" className={INPUT} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Nama Lengkap</label>
                  <input required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    placeholder="Nama lengkap klien" className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Universitas</label>
                  <input required value={form.university} onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
                    placeholder="Nama universitas" className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">No. HP</label>
                  <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="08xxx" className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Produk</label>
                  <select required value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))} className={SELECT}>
                    <option value="fastrack">Fastrack</option>
                    <option value="mentoring-sempro">Mentoring Sempro</option>
                    <option value="mentoring-penelitian">Mentoring Penelitian</option>
                    <option value="all">All Access</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Aktif Sampai</label>
                  <input required type="date" value={form.active_until} onChange={e => setForm(f => ({ ...f, active_until: e.target.value }))}
                    className={INPUT} />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowModal(false); setError('') }}
                  className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={isPending}
                  className="flex-1 bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  {isPending ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Buat Akun'}
                </button>
              </div>
              <p className="text-[#9CA3AF] text-xs text-center">Email set password otomatis dikirim ke klien setelah akun dibuat.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
