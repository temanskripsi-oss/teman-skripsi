'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Target, Send, Handshake, Radio, XCircle, Plus, Loader2, X, MoreVertical, Copy, Trash2, ExternalLink } from 'lucide-react'
import type { CollabsProspect, ProspectStatus, FormatCollab } from '@/types'

const INPUT = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all placeholder:text-gray-400'

const STATUS_LABEL: Record<ProspectStatus, string> = {
  target: 'Target', dm_sent: 'DM Sent', deal: 'Deal', live: 'Live', rejected: 'Rejected',
}
const STATUS_BADGE: Record<ProspectStatus, string> = {
  target: 'text-gray-700 bg-gray-100 border-gray-200',
  dm_sent: 'text-yellow-800 bg-yellow-100 border-yellow-200',
  deal: 'text-blue-800 bg-blue-100 border-blue-200',
  live: 'text-green-800 bg-green-100 border-green-200',
  rejected: 'text-red-700 bg-red-100 border-red-200',
}
const FORMAT_LABEL: Record<FormatCollab, string> = { sg_statis: 'SG Statis', video_promosi: 'Video Promosi' }

function formatFollowers(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return `${n}`
}

function tierPrefix(followers: number) {
  if (followers >= 10_000) return 'KOL'
  if (followers >= 5_000) return 'MC'
  return ''
}

export default function CollabsHunterPage() {
  const [prospects, setProspects] = useState<CollabsProspect[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ProspectStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState<string | null>(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [addForm, setAddForm] = useState({ username_ig: '', followers_count: '', kampus: '', notes: '' })

  const [dealTarget, setDealTarget] = useState<CollabsProspect | null>(null)
  const [dealFormat, setDealFormat] = useState<FormatCollab>('sg_statis')
  const [dealSaving, setDealSaving] = useState(false)

  const [detailTarget, setDetailTarget] = useState<CollabsProspect | null>(null)

  const fetchProspects = useCallback(async () => {
    const res = await fetch('/api/admin/collabs-hunter')
    const data = await res.json()
    setProspects(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProspects() }, [fetchProspects])

  const stats = useMemo(() => {
    const counts: Record<ProspectStatus, number> = { target: 0, dm_sent: 0, deal: 0, live: 0, rejected: 0 }
    for (const p of prospects) counts[p.status]++
    return counts
  }, [prospects])

  const filtered = useMemo(() => {
    return prospects.filter(p => {
      if (filter !== 'all' && p.status !== filter) return false
      if (search && !p.username_ig.toLowerCase().includes(search.toLowerCase()) && !(p.kampus ?? '').toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [prospects, filter, search])

  const openAdd = () => {
    setAddForm({ username_ig: '', followers_count: '', kampus: '', notes: '' })
    setShowAddModal(true)
  }

  const handleAddSave = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/collabs-hunter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...addForm, followers_count: Number(addForm.followers_count) || 0 }),
    })
    const data = await res.json()
    if (!res.ok) { alert(data.error); setSaving(false); return }
    setShowAddModal(false)
    await fetchProspects()
    setSaving(false)
  }

  const updateStatus = async (p: CollabsProspect, status: ProspectStatus) => {
    setMenuId(null)
    if (status === 'deal') {
      setDealFormat('sg_statis')
      setDealTarget(p)
      return
    }
    await fetch('/api/admin/collabs-hunter', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, status }),
    })
    await fetchProspects()
  }

  const confirmDeal = async () => {
    if (!dealTarget) return
    setDealSaving(true)
    const res = await fetch('/api/admin/collabs-hunter', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: dealTarget.id, status: 'deal', format_collab: dealFormat }),
    })
    const data = await res.json()
    if (!res.ok) { alert(data.error); setDealSaving(false); return }
    setDealTarget(null)
    await fetchProspects()
    setDealSaving(false)
  }

  const deleteProspect = async (p: CollabsProspect) => {
    setMenuId(null)
    if (!confirm(`Hapus prospect @${p.username_ig}?`)) return
    const res = await fetch('/api/admin/collabs-hunter', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id }),
    })
    if (!res.ok) { const data = await res.json(); alert(data.error); return }
    await fetchProspects()
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const dealPrefix = dealTarget ? tierPrefix(dealTarget.followers_count) : ''
  const dealSanitized = dealTarget ? dealTarget.username_ig.replace(/[._\-\s]/g, '').toUpperCase() : ''

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-[#9CA3AF] text-sm mb-1">Admin Panel</p>
          <h1 className="text-3xl font-bold text-[#1E1B4B]">Collabs Hunter</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Outreach & affiliate pipeline buat KOL dan base account kampus</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-[#2232dd] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1a28b8] transition-colors flex-shrink-0">
          <Plus size={15} /> Tambah Prospect
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { key: 'target', label: 'Target', icon: Target, color: '#6B7280', bg: '#f3f4f6' },
          { key: 'dm_sent', label: 'DM Sent', icon: Send, color: '#ca8a04', bg: '#fefce8' },
          { key: 'deal', label: 'Deal', icon: Handshake, color: '#2232dd', bg: '#eff6ff' },
          { key: 'live', label: 'Live', icon: Radio, color: '#16a34a', bg: '#f0fdf4' },
          { key: 'rejected', label: 'Rejected', icon: XCircle, color: '#dc2626', bg: '#fef2f2' },
        ].map(s => {
          const Icon = s.icon
          return (
            <button key={s.key} onClick={() => setFilter(filter === s.key ? 'all' : s.key as ProspectStatus)}
              className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-3 text-left transition-all ${filter === s.key ? 'border-[#2232dd] ring-1 ring-[#2232dd]/20' : 'border-gray-100 hover:border-gray-200'}`}>
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: s.bg, color: s.color }}>
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-[#1E1B4B] truncate">{stats[s.key as ProspectStatus]}</p>
                <p className="text-[#9CA3AF] text-xs">{s.label}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-3 mb-6">
        <select value={filter} onChange={e => setFilter(e.target.value as ProspectStatus | 'all')}
          className="border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 bg-white">
          <option value="all">Semua Status</option>
          {(Object.keys(STATUS_LABEL) as ProspectStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari username atau kampus..."
          className="flex-1 max-w-xs border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 placeholder:text-gray-400" />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
          <Loader2 size={24} className="animate-spin text-[#9CA3AF] mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
          <p className="text-[#9CA3AF] text-sm">Belum ada prospect. Tambah prospect pertama!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#fafafa]">
                  {['Username', 'Followers', 'Kampus', 'Status', 'Format', 'Kode', 'Sales', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-[#9CA3AF] text-xs font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-[#fafafa] transition-colors align-top">
                    <td className="px-5 py-3.5">
                      <button onClick={() => setDetailTarget(p)} className="font-semibold text-[#1E1B4B] hover:text-[#2232dd] transition-colors">
                        @{p.username_ig}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-[#6B6B8A]">{formatFollowers(p.followers_count)}</td>
                    <td className="px-5 py-3.5 text-[#6B6B8A] text-xs">{p.kampus ?? '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap w-fit inline-block ${STATUS_BADGE[p.status]}`}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#6B6B8A] text-xs">{p.format_collab ? FORMAT_LABEL[p.format_collab] : '-'}</td>
                    <td className="px-5 py-3.5">
                      {p.affiliate_code_ft || p.affiliate_code_mp ? (
                        <div className="flex flex-col gap-1">
                          {p.affiliate_code_ft && (
                            <button onClick={() => copyCode(p.affiliate_code_ft!)} className="flex items-center gap-1 text-xs bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20 px-2 py-0.5 rounded-full font-bold whitespace-nowrap w-fit hover:bg-[#e0e7ff] transition-colors">
                              {p.affiliate_code_ft} <Copy size={10} />
                            </button>
                          )}
                          {p.affiliate_code_mp && (
                            <button onClick={() => copyCode(p.affiliate_code_mp!)} className="flex items-center gap-1 text-xs bg-[#f5f3ff] text-[#7C6FCD] border border-[#7C6FCD]/20 px-2 py-0.5 rounded-full font-bold whitespace-nowrap w-fit hover:bg-[#ede9fe] transition-colors">
                              {p.affiliate_code_mp} <Copy size={10} />
                            </button>
                          )}
                        </div>
                      ) : <span className="text-xs text-[#9CA3AF]">-</span>}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#1E1B4B]">{(p.sales_ft ?? 0) + (p.sales_mp ?? 0)}</td>
                    <td className="px-5 py-3.5 relative">
                      <button onClick={() => setMenuId(menuId === p.id ? null : p.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#9CA3AF] transition-colors">
                        <MoreVertical size={14} />
                      </button>
                      {menuId === p.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />
                          <div className="absolute right-5 top-11 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 w-44">
                            {(Object.keys(STATUS_LABEL) as ProspectStatus[]).filter(s => s !== p.status).map(s => (
                              <button key={s} onClick={() => updateStatus(p, s)}
                                className="w-full text-left px-4 py-2 text-xs text-[#1E1B4B] hover:bg-gray-50 transition-colors">
                                Jadikan {STATUS_LABEL[s]}
                              </button>
                            ))}
                            <div className="border-t border-gray-100 my-1.5" />
                            <button onClick={() => deleteProspect(p)}
                              className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1.5">
                              <Trash2 size={12} /> Hapus
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah Prospect */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1E1B4B]">Tambah Prospect Baru</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#9CA3AF]"><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Username IG *</label>
                <input className={INPUT} placeholder="username (tanpa @)" value={addForm.username_ig}
                  onChange={e => setAddForm(f => ({ ...f, username_ig: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Followers Count *</label>
                <input className={INPUT} type="number" placeholder="8200" value={addForm.followers_count}
                  onChange={e => setAddForm(f => ({ ...f, followers_count: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Kampus</label>
                <input className={INPUT} placeholder="UIN RIL" value={addForm.kampus}
                  onChange={e => setAddForm(f => ({ ...f, kampus: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Notes</label>
                <textarea className={INPUT} rows={3} placeholder="Catatan tambahan..." value={addForm.notes}
                  onChange={e => setAddForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#9CA3AF] hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button onClick={handleAddSave} disabled={saving || !addForm.username_ig || !addForm.followers_count}
                className="flex-1 py-2.5 rounded-xl bg-[#2232dd] text-white text-sm font-bold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Update ke Deal */}
      {dealTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDealTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1E1B4B]">Mark @{dealTarget.username_ig} sebagai Deal</h2>
              <button onClick={() => setDealTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#9CA3AF]"><X size={16} /></button>
            </div>

            <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Pilih format collabs</label>
            <div className="flex flex-col gap-2 mb-4">
              {(['sg_statis', 'video_promosi'] as FormatCollab[]).map(f => (
                <button key={f} onClick={() => setDealFormat(f)}
                  className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 text-sm text-left transition-colors ${dealFormat === f ? 'border-[#2232dd] bg-[#eff6ff] text-[#2232dd] font-semibold' : 'border-gray-200 text-[#1E1B4B] hover:bg-gray-50'}`}>
                  <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${dealFormat === f ? 'border-[#2232dd] bg-[#2232dd]' : 'border-gray-300'}`} />
                  {FORMAT_LABEL[f]}
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold text-[#1E1B4B] mb-1.5">Kode yang akan di-generate</p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-3 mb-4 flex flex-col gap-1">
              <p className="font-mono text-sm font-bold text-[#2232dd]">{dealPrefix}{dealSanitized}50 <span className="text-[10px] font-sans font-normal text-[#9CA3AF]">Fast Track</span></p>
              <p className="font-mono text-sm font-bold text-[#7C6FCD]">{dealPrefix}{dealSanitized}100 <span className="text-[10px] font-sans font-normal text-[#9CA3AF]">Mentoring Privat</span></p>
            </div>

            <div className="bg-[#f5f3ff] border border-[#7C6FCD]/15 rounded-xl px-3.5 py-3 mb-2">
              <p className="text-xs text-[#7C6FCD] font-semibold mb-1">Komisi:</p>
              <p className="text-[11px] text-[#6B6B8A]">Fast Track: Rp 50.000 / closing</p>
              <p className="text-[11px] text-[#6B6B8A]">Mentoring Privat: Rp 100.000 / closing</p>
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setDealTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#9CA3AF] hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button onClick={confirmDeal} disabled={dealSaving}
                className="flex-1 py-2.5 rounded-xl bg-[#2232dd] text-white text-sm font-bold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {dealSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                Confirm & Deal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Prospect */}
      {detailTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetailTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#1E1B4B]">@{detailTarget.username_ig}</h2>
                <a href={`https://instagram.com/${detailTarget.username_ig}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-[#2232dd] flex items-center gap-1 mt-0.5 hover:underline w-fit">
                  Lihat profil IG <ExternalLink size={10} />
                </a>
              </div>
              <button onClick={() => setDetailTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#9CA3AF]"><X size={16} /></button>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              <TimelineRow label="Created" date={detailTarget.created_at} />
              <TimelineRow label="DM Sent" date={detailTarget.dm_sent_at} />
              <TimelineRow label="Deal" date={detailTarget.deal_at} />
              <TimelineRow label="Live" date={detailTarget.live_at} />
            </div>

            {detailTarget.notes && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-[#1E1B4B] mb-1.5">Notes</p>
                <p className="text-sm text-[#6B6B8A] bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-3">{detailTarget.notes}</p>
              </div>
            )}

            {(detailTarget.affiliate_code_ft || detailTarget.affiliate_code_mp) && (
              <div>
                <p className="text-xs font-semibold text-[#1E1B4B] mb-1.5">Performance</p>
                <div className="flex flex-col gap-1.5">
                  {detailTarget.affiliate_code_ft && (
                    <div className="flex items-center justify-between border border-gray-100 bg-gray-50 rounded-xl px-3.5 py-2.5">
                      <span className="font-mono text-xs font-bold text-[#2232dd]">{detailTarget.affiliate_code_ft}</span>
                      <span className="text-xs text-[#1E1B4B] font-semibold">{detailTarget.sales_ft ?? 0} closing</span>
                    </div>
                  )}
                  {detailTarget.affiliate_code_mp && (
                    <div className="flex items-center justify-between border border-gray-100 bg-gray-50 rounded-xl px-3.5 py-2.5">
                      <span className="font-mono text-xs font-bold text-[#7C6FCD]">{detailTarget.affiliate_code_mp}</span>
                      <span className="text-xs text-[#1E1B4B] font-semibold">{detailTarget.sales_mp ?? 0} closing</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function TimelineRow({ label, date }: { label: string; date: string | null }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#9CA3AF]">{label}</span>
      <span className={`text-xs font-medium ${date ? 'text-[#1E1B4B]' : 'text-gray-300'}`}>
        {date ? new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
      </span>
    </div>
  )
}
