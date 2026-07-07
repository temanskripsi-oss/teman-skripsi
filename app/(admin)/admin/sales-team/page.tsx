'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Users, TrendingUp, DollarSign, Trophy, Plus, Edit2, ToggleLeft, ToggleRight, Loader2, X, CheckCircle, Clock, Trash2 } from 'lucide-react'
import type { AffiliateCode, AffiliateTransaction } from '@/types'

const INPUT = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all placeholder:text-gray-400'

const PRODUCT_LABEL: Record<string, string> = { fastrack: 'Fastrack', mentoring: 'Mentoring' }

type Tab = 'sales' | 'komisi'

interface SalesGroup {
  sales_email: string
  sales_name: string
  sales_whatsapp: string | null
  codes: AffiliateCode[]
  total_sales: number
  total_commission: number
}

export default function SalesTeamPage() {
  const [tab, setTab] = useState<Tab>('sales')
  const [salesList, setSalesList] = useState<AffiliateCode[]>([])
  const [transactions, setTransactions] = useState<AffiliateTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<SalesGroup | null>(null)
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [markingId, setMarkingId] = useState<string | null>(null)

  const [form, setForm] = useState({ sales_name: '', sales_email: '', sales_password: '', sales_whatsapp: '' })

  const fetchSales = useCallback(async () => {
    const [s, t] = await Promise.all([
      fetch('/api/admin/sales-team').then(r => r.json()),
      fetch('/api/admin/affiliate-transactions').then(r => r.json()),
    ])
    setSalesList(s)
    setTransactions(t)
    setLoading(false)
  }, [])

  useEffect(() => { fetchSales() }, [fetchSales])

  const salesGroups = useMemo<SalesGroup[]>(() => {
    const map = new Map<string, SalesGroup>()
    for (const s of salesList) {
      const existing = map.get(s.sales_email)
      if (existing) {
        existing.codes.push(s)
        existing.total_sales += s.total_sales
        existing.total_commission += s.total_commission
      } else {
        map.set(s.sales_email, {
          sales_email: s.sales_email,
          sales_name: s.sales_name,
          sales_whatsapp: s.sales_whatsapp,
          codes: [s],
          total_sales: s.total_sales,
          total_commission: s.total_commission,
        })
      }
    }
    return Array.from(map.values()).sort((a, b) => b.total_sales - a.total_sales)
  }, [salesList])

  const openAdd = () => {
    setEditTarget(null)
    setForm({ sales_name: '', sales_email: '', sales_password: '', sales_whatsapp: '' })
    setShowModal(true)
  }

  const openEdit = (g: SalesGroup) => {
    setEditTarget(g)
    setForm({ sales_name: g.sales_name, sales_email: g.sales_email, sales_password: '', sales_whatsapp: g.sales_whatsapp ?? '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editTarget) {
      await fetch('/api/admin/sales-team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_email: editTarget.sales_email, ...form }),
      })
    } else {
      const res = await fetch('/api/admin/sales-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error); setSaving(false); return }
    }
    setShowModal(false)
    await fetchSales()
    setSaving(false)
  }

  const toggleActive = async (s: AffiliateCode) => {
    setTogglingId(s.id)
    await fetch('/api/admin/sales-team', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: s.id, is_active: !s.is_active }),
    })
    await fetchSales()
    setTogglingId(null)
  }

  const markPaid = async (id: string) => {
    setMarkingId(id)
    await fetch('/api/admin/affiliate-transactions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'paid' }),
    })
    await fetchSales()
    setMarkingId(null)
  }

  const deleteSales = async (g: SalesGroup) => {
    if (!confirm(`Hapus sales "${g.sales_name}"? Kedua kode (${g.codes.map(c => c.code).join(', ')}) tidak bisa dipakai lagi.`)) return
    await fetch('/api/admin/sales-team', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sales_email: g.sales_email }),
    })
    await fetchSales()
  }

  const topSales = salesGroups[0]
  const totalClosing = salesGroups.reduce((s, a) => s + a.total_sales, 0)
  const totalCommissionPending = transactions.filter(t => t.status === 'pending').reduce((s, t) => s + t.commission_amount, 0)

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-[#9CA3AF] text-sm mb-1">Admin Panel</p>
          <h1 className="text-3xl font-bold text-[#1E1B4B]">Sales Team</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Kelola affiliate dan pantau performa</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-[#2232dd] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1a28b8] transition-colors flex-shrink-0">
          <Plus size={15} /> Tambah Sales
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Sales', value: salesGroups.length, icon: Users, color: '#2232dd', bg: '#eff6ff' },
          { label: 'Total Closing', value: totalClosing, icon: TrendingUp, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Komisi Pending', value: `Rp ${(totalCommissionPending/1000).toFixed(0)}rb`, icon: DollarSign, color: '#ea580c', bg: '#fff7ed' },
          { label: 'Top Performer', value: topSales?.sales_name.split(' ')[0] ?? '-', icon: Trophy, color: '#7C6FCD', bg: '#f5f3ff' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: s.bg, color: s.color }}>
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-[#1E1B4B] truncate">{s.value}</p>
                <p className="text-[#9CA3AF] text-xs">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
        {(['sales', 'komisi'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? 'bg-white text-[#1E1B4B] shadow-sm' : 'text-[#9CA3AF] hover:text-[#1E1B4B]'}`}>
            {t === 'sales' ? 'Sales Team' : 'Komisi'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
          <Loader2 size={24} className="animate-spin text-[#9CA3AF] mx-auto" />
        </div>
      ) : tab === 'sales' ? (
        /* Sales Table */
        salesGroups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
            <p className="text-[#9CA3AF] text-sm">Belum ada sales team. Tambah sales pertama!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#fafafa]">
                    {['Nama', 'Kode Diskon', 'Email', 'WhatsApp', 'Closing', 'Komisi', 'Aksi'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-[#9CA3AF] text-xs font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {salesGroups.map(g => (
                    <tr key={g.sales_email} className="hover:bg-[#fafafa] transition-colors align-top">
                      <td className="px-5 py-3.5 font-semibold text-[#1E1B4B]">{g.sales_name}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1.5">
                          {g.codes.map(c => (
                            <div key={c.id} className="flex items-center gap-1.5">
                              <span className="text-xs bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20 px-2.5 py-1 rounded-full font-bold whitespace-nowrap">{c.code}</span>
                              <span className="text-[10px] text-[#9CA3AF]">{PRODUCT_LABEL[c.product] ?? c.product}</span>
                              <button onClick={() => toggleActive(c)} disabled={togglingId === c.id} className="p-1 rounded hover:bg-gray-100 text-[#9CA3AF] transition-colors" title={c.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
                                {togglingId === c.id ? <Loader2 size={12} className="animate-spin" /> : c.is_active ? <ToggleRight size={12} className="text-[#16a34a]" /> : <ToggleLeft size={12} />}
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#6B6B8A] text-xs">{g.sales_email}</td>
                      <td className="px-5 py-3.5 text-[#6B6B8A] text-xs">{g.sales_whatsapp ?? '-'}</td>
                      <td className="px-5 py-3.5 font-bold text-[#1E1B4B]">{g.total_sales}</td>
                      <td className="px-5 py-3.5 text-[#1E1B4B] text-xs font-medium">Rp {g.total_commission.toLocaleString('id-ID')}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(g)} className="p-1.5 rounded-lg hover:bg-[#eff6ff] text-[#2232dd] transition-colors" title="Edit">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => deleteSales(g)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Hapus">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Komisi Table */
        <div>
          {totalCommissionPending > 0 && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-orange-500" />
                <span className="text-sm font-semibold text-orange-700">Komisi Pending: Rp {totalCommissionPending.toLocaleString('id-ID')}</span>
              </div>
            </div>
          )}
          {transactions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
              <p className="text-[#9CA3AF] text-sm">Belum ada transaksi komisi.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#fafafa]">
                      {['Tanggal', 'Kode Sales', 'Buyer', 'Komisi', 'Status', 'Aksi'].map(h => (
                        <th key={h} className="text-left px-5 py-3.5 text-[#9CA3AF] text-xs font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="px-5 py-3.5 text-[#9CA3AF] text-xs whitespace-nowrap">
                          {new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20 px-2.5 py-1 rounded-full font-bold">{t.affiliate_code}</span>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-[#1E1B4B]">{t.buyer_name}</td>
                        <td className="px-5 py-3.5 font-semibold text-[#1E1B4B]">Rp {t.commission_amount.toLocaleString('id-ID')}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap flex items-center gap-1 w-fit ${t.status === 'paid' ? 'text-[#16a34a] bg-green-50 border-green-100' : 'text-orange-500 bg-orange-50 border-orange-100'}`}>
                            {t.status === 'paid' ? <CheckCircle size={10} /> : <Clock size={10} />}
                            {t.status === 'paid' ? 'Lunas' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {t.status === 'pending' ? (
                            <button onClick={() => markPaid(t.id)} disabled={markingId === t.id}
                              className="flex items-center gap-1.5 text-xs font-semibold bg-[#16a34a] text-white px-3 py-1.5 rounded-lg hover:bg-[#15803d] disabled:opacity-60 transition-colors">
                              {markingId === t.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                              Tandai Lunas
                            </button>
                          ) : (
                            <span className="text-xs text-[#9CA3AF]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1E1B4B]">{editTarget ? 'Edit Sales' : 'Tambah Sales Team'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#9CA3AF]"><X size={16} /></button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Nama Lengkap *</label>
                <input className={INPUT} placeholder="Andi Rahmat" value={form.sales_name}
                  onChange={e => setForm(f => ({ ...f, sales_name: e.target.value }))} />
              </div>

              {editTarget ? (
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Kode Diskon</label>
                  <div className="flex flex-col gap-1.5">
                    {editTarget.codes.map(c => (
                      <div key={c.id} className="flex items-center gap-2 border border-gray-100 bg-gray-50 rounded-xl px-3 py-2">
                        <span className="text-xs bg-white text-[#2232dd] border border-[#2232dd]/20 px-2.5 py-1 rounded-full font-bold">{c.code}</span>
                        <span className="text-[11px] text-[#9CA3AF]">{PRODUCT_LABEL[c.product] ?? c.product} · Rp {c.discount_amount.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#eff6ff] border border-[#2232dd]/15 rounded-xl px-3.5 py-3">
                  <p className="text-xs text-[#2232dd] font-semibold mb-1">2 kode diskon otomatis dibuat:</p>
                  <p className="text-[11px] text-[#6B6B8A]">Fastrack: <span className="font-mono font-semibold">FT{(form.sales_name.trim().split(' ')[0] || 'NAMA').toUpperCase().replace(/[^A-Z]/g, '')}50</span> · Rp 50.000</p>
                  <p className="text-[11px] text-[#6B6B8A]">Mentoring Privat: <span className="font-mono font-semibold">MP{(form.sales_name.trim().split(' ')[0] || 'NAMA').toUpperCase().replace(/[^A-Z]/g, '')}100</span> · Rp 100.000</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Email *</label>
                <input className={INPUT} type="email" placeholder="andi@gmail.com" value={form.sales_email}
                  onChange={e => setForm(f => ({ ...f, sales_email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">
                  Password {editTarget && <span className="text-[#9CA3AF] font-normal">(kosongkan jika tidak diganti)</span>}
                </label>
                <input className={INPUT} type="password" placeholder="••••••••" value={form.sales_password}
                  onChange={e => setForm(f => ({ ...f, sales_password: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">No. WhatsApp</label>
                <input className={INPUT} placeholder="08xxxxxxxxxx" value={form.sales_whatsapp}
                  onChange={e => setForm(f => ({ ...f, sales_whatsapp: e.target.value }))} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#9CA3AF] hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving || !form.sales_name || !form.sales_email || (!editTarget && !form.sales_password)}
                className="flex-1 py-2.5 rounded-xl bg-[#2232dd] text-white text-sm font-bold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                {editTarget ? 'Simpan' : 'Tambah Sales'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
