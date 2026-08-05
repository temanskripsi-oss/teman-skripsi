'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Target, Send, Handshake, Radio, XCircle, Plus, Loader2, X, MoreVertical, Copy, Trash2, ExternalLink, Clock, MessageSquare, ChevronDown, Check } from 'lucide-react'
import type { CollabsProspect, ProspectStatus, FormatCollab, DmStatus } from '@/types'

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

const DM_STATUS_LABEL: Record<DmStatus, string> = {
  belum_dm: 'Belum DM', terkirim: 'Terkirim', balas: 'Balas', pindah_wa: 'Pindah WA', closing: 'Closing', ghosting: 'Ghosting',
}
const DM_STATUS_TEXT: Record<DmStatus, string> = {
  belum_dm: 'text-gray-500', terkirim: 'text-[#2232dd]', balas: 'text-[#16a34a]', pindah_wa: 'text-[#7C6FCD]', closing: 'text-[#16a34a] font-bold', ghosting: 'text-red-500',
}

function formatFollowers(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return `${n}`
}

function tierPrefix(followers: number) {
  if (followers >= 10_000) return 'KOL'
  if (followers >= 5_000) return 'MC'
  return ''
}

// Template DM awal — sengaja disimpen di localStorage (bukan DB) biar bisa diubah-ubah
// sambil nyari angle yang works, tanpa migration/deploy.
const TEMPLATE_KEY = 'collabs_hunter_dm_template'
const DEFAULT_DM_TEMPLATE = `Halo kak @{username}! 👋

Aku Reza dari Teman Skripsi — kita bantu mahasiswa nyelesain skripsi lewat program Fast Track & Mentoring Privat.

Aku lihat konten kakak, dan kayaknya banyak followers kakak yang lagi di fase skripsi. Kita lagi buka kerja sama affiliate nih:

• Kakak dapet kode diskon atas nama sendiri
• Tiap ada yang daftar pakai kode kakak, komisinya Rp50.000 (Fast Track) / Rp100.000 (Mentoring Privat)
• Nggak ada target, nggak ada biaya apa pun

Followers kakak dapet diskon, kakak dapet komisi.

Kalau tertarik, aku kirimin detail lengkapnya ya kak?`

function fillTemplate(tpl: string, p: CollabsProspect) {
  return tpl
    .replace(/\{username\}/g, p.username_ig)
    .replace(/\{kampus\}/g, p.kampus ?? '')
    .replace(/\{followers\}/g, formatFollowers(p.followers_count))
}

// Target harian yang dikontrol penuh (activity), dipisah dari target deal mingguan (outcome)
const DAILY_DM_TARGET = 20
const WEEKLY_DEAL_MIN = 2
const WEEKLY_DEAL_MAX = 5
const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

/** YYYY-MM-DD di timezone lokal (bukan UTC, biar ga geser sehari) */
function localDay(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** Senin dari minggu berjalan */
function startOfWeek(base = new Date()) {
  const d = new Date(base)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d
}

export default function CollabsHunterPage() {
  const [prospects, setProspects] = useState<CollabsProspect[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ProspectStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState<string | null>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [addForm, setAddForm] = useState({ username_ig: '', followers_count: '', kampus: '', notes: '' })

  const [dealTarget, setDealTarget] = useState<CollabsProspect | null>(null)
  const [dealFormat, setDealFormat] = useState<FormatCollab>('sg_statis')
  const [dealSaving, setDealSaving] = useState(false)

  const [detailTarget, setDetailTarget] = useState<CollabsProspect | null>(null)

  const [template, setTemplate] = useState(DEFAULT_DM_TEMPLATE)
  const [showTemplate, setShowTemplate] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(TEMPLATE_KEY)
    if (saved) setTemplate(saved)
  }, [])

  const saveTemplate = (value: string) => {
    setTemplate(value)
    localStorage.setItem(TEMPLATE_KEY, value)
  }

  const copyDm = (p: CollabsProspect) => {
    navigator.clipboard.writeText(fillTemplate(template, p))
    setMenuId(null)
    setCopiedId(p.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

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

  // Counter harian & mingguan diturunin dari dm_sent_at/deal_at — ga ada input manual,
  // jadi angkanya selalu nyambung ke prospect beneran.
  const tracker = useMemo(() => {
    const today = localDay(new Date())
    const monday = startOfWeek()

    const week = DAY_LABELS.map((label, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      const key = localDay(d)
      return {
        label,
        key,
        isToday: key === today,
        isFuture: key > today,
        count: prospects.filter(p => p.dm_sent_at && localDay(p.dm_sent_at) === key).length,
      }
    })

    const mondayKey = localDay(monday)
    const weekDeals = prospects.filter(p => p.deal_at && localDay(p.deal_at) >= mondayKey).length
    const weekDm = week.reduce((s, d) => s + d.count, 0)
    const weekReplies = prospects.filter(
      p => p.dm_sent_at && localDay(p.dm_sent_at) >= mondayKey && ['balas', 'pindah_wa', 'closing'].includes(p.dm_status)
    ).length

    return {
      today: week.find(d => d.isToday)?.count ?? 0,
      week,
      weekDm,
      weekDeals,
      weekReplies,
      replyRate: weekDm > 0 ? (weekReplies / weekDm) * 100 : 0,
    }
  }, [prospects])

  const followups = useMemo(() => {
    const today = localDay(new Date())
    return prospects
      .filter(p => p.next_followup_at && p.next_followup_at <= today)
      .sort((a, b) => (a.next_followup_at! < b.next_followup_at! ? -1 : 1))
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

  const updateDmStatus = async (p: CollabsProspect, dm_status: DmStatus) => {
    setProspects(prev => prev.map(x => x.id === p.id ? { ...x, dm_status } : x))
    await fetch('/api/admin/collabs-hunter', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, dm_status }),
    })
    // Server ikut nge-set dm_sent_at/status/next_followup_at, jadi counter harian
    // & panel follow-up baru bener kalau di-refetch
    await fetchProspects()
  }

  /** Geser jadwal follow-up: +n hari, atau null buat nyeleseiin */
  const rescheduleFollowup = async (p: CollabsProspect, days: number | null) => {
    let next: string | null = null
    if (days !== null) {
      const d = new Date()
      d.setDate(d.getDate() + days)
      next = localDay(d)
    }
    setProspects(prev => prev.map(x => x.id === p.id ? { ...x, next_followup_at: next } : x))
    await fetch('/api/admin/collabs-hunter', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, next_followup_at: next }),
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

      {/* Daily DM tracker */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-sm font-semibold text-[#1E1B4B]">DM Terkirim Hari Ini</p>
          <p className="text-sm font-bold text-[#1E1B4B]">
            {tracker.today}<span className="text-[#9CA3AF] font-medium">/{DAILY_DM_TARGET}</span>
          </p>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-5">
          <div className="h-full bg-[#2232dd] rounded-full transition-all"
            style={{ width: `${Math.min(100, (tracker.today / DAILY_DM_TARGET) * 100)}%` }} />
        </div>

        <div className="grid grid-cols-7 gap-2">
          {tracker.week.map(d => (
            <div key={d.key}
              className={`rounded-xl border py-2.5 text-center ${d.isToday ? 'border-[#2232dd] ring-1 ring-[#2232dd]/20 bg-[#f8f9ff]' : 'border-gray-100 bg-[#fafafa]'}`}>
              <p className="text-[11px] text-[#9CA3AF] mb-0.5">{d.label}</p>
              <p className={`text-sm font-bold ${d.isFuture ? 'text-gray-300' : d.count >= DAILY_DM_TARGET ? 'text-[#16a34a]' : 'text-[#1E1B4B]'}`}>
                {d.isFuture ? '–' : d.count}
                {!d.isFuture && <span className="text-[10px] text-[#9CA3AF] font-medium">/{DAILY_DM_TARGET}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ringkasan minggu berjalan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[
          { label: 'DM Minggu Ini', value: `${tracker.weekDm}`, sub: `target ${DAILY_DM_TARGET * 5}/minggu` },
          { label: 'Balas', value: `${tracker.weekReplies}`, sub: `${tracker.replyRate.toFixed(1)}% reply rate` },
          { label: 'Deal Minggu Ini', value: `${tracker.weekDeals}`, sub: `target ${WEEKLY_DEAL_MIN}–${WEEKLY_DEAL_MAX}/minggu`, highlight: tracker.weekDeals >= WEEKLY_DEAL_MIN },
          { label: 'Perlu Follow-up', value: `${followups.length}`, sub: 'udah waktunya di-chat', warn: followups.length > 0 },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-[#9CA3AF] text-xs mb-1">{c.label}</p>
            <p className={`text-2xl font-bold ${c.highlight ? 'text-[#16a34a]' : c.warn ? 'text-[#ca8a04]' : 'text-[#1E1B4B]'}`}>{c.value}</p>
            <p className="text-[#9CA3AF] text-[11px] mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Follow-up hari ini */}
      {followups.length > 0 && (
        <div className="bg-[#fffbeb] border border-[#fbbf24]/40 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={15} className="text-[#b45309]" />
            <p className="text-sm font-bold text-[#b45309]">Follow-up Hari Ini ({followups.length})</p>
          </div>
          <div className="flex flex-col gap-2">
            {followups.map(p => (
              <div key={p.id} className="bg-white border border-[#fbbf24]/30 rounded-xl px-3.5 py-2.5 flex items-center gap-3 flex-wrap">
                <a href={`https://instagram.com/${p.username_ig}`} target="_blank" rel="noopener noreferrer"
                  className="font-semibold text-sm text-[#1E1B4B] hover:text-[#2232dd] flex items-center gap-1">
                  @{p.username_ig} <ExternalLink size={11} />
                </a>
                <span className="text-xs text-[#9CA3AF]">{formatFollowers(p.followers_count)}</span>
                <span className={`text-xs font-medium ${DM_STATUS_TEXT[p.dm_status]}`}>{DM_STATUS_LABEL[p.dm_status]}</span>
                {p.next_followup_at! < localDay(new Date()) && (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                    telat {Math.round((Date.now() - new Date(p.next_followup_at!).getTime()) / 86_400_000)}h
                  </span>
                )}
                <div className="ml-auto flex items-center gap-1.5">
                  <button onClick={() => copyDm(p)}
                    className="text-[11px] font-semibold text-[#7C6FCD] border border-[#7C6FCD]/30 rounded-lg px-2.5 py-1 hover:bg-[#f5f3ff] transition-colors">
                    {copiedId === p.id ? 'Tersalin!' : 'Salin DM'}
                  </button>
                  <button onClick={() => rescheduleFollowup(p, 3)}
                    className="text-[11px] font-semibold text-[#6B6B8A] border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50 transition-colors">
                    Tunda 3h
                  </button>
                  <button onClick={() => rescheduleFollowup(p, null)}
                    className="text-[11px] font-semibold text-[#16a34a] border border-[#16a34a]/30 rounded-lg px-2.5 py-1 hover:bg-[#f0fdf4] transition-colors">
                    Selesai
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Template DM */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
        <button onClick={() => setShowTemplate(v => !v)}
          className="w-full flex items-center gap-2.5 px-5 py-3.5 text-left hover:bg-[#fafafa] transition-colors">
          <MessageSquare size={15} className="text-[#7C6FCD] flex-shrink-0" />
          <span className="text-sm font-semibold text-[#1E1B4B]">Template DM</span>
          <span className="text-xs text-[#9CA3AF]">— dipakai tombol &ldquo;Salin DM&rdquo; di tiap prospect</span>
          <ChevronDown size={15} className={`ml-auto text-[#9CA3AF] transition-transform ${showTemplate ? 'rotate-180' : ''}`} />
        </button>
        {showTemplate && (
          <div className="px-5 pb-5 border-t border-gray-50 pt-4">
            <textarea value={template} onChange={e => saveTemplate(e.target.value)} rows={14}
              className={`${INPUT} font-mono text-xs leading-relaxed resize-y`} />
            <div className="flex items-center justify-between gap-3 mt-2.5 flex-wrap">
              <p className="text-[11px] text-[#9CA3AF]">
                Placeholder: <code className="text-[#7C6FCD]">{'{username}'}</code>{' '}
                <code className="text-[#7C6FCD]">{'{kampus}'}</code>{' '}
                <code className="text-[#7C6FCD]">{'{followers}'}</code> — auto-keisi per prospect. Kesimpen di browser ini aja.
              </p>
              <button onClick={() => saveTemplate(DEFAULT_DM_TEMPLATE)}
                className="text-[11px] font-semibold text-[#9CA3AF] border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50 transition-colors flex-shrink-0">
                Reset ke default
              </button>
            </div>
          </div>
        )}
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
                  {['Username', 'Followers', 'Kampus', 'Status', 'Status DM', 'Follow-up', 'Format', 'Kode', 'Sales', 'Aksi'].map(h => (
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
                    <td className="px-5 py-3.5">
                      <select value={p.dm_status} onChange={e => updateDmStatus(p, e.target.value as DmStatus)}
                        className={`text-xs font-medium bg-transparent border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 cursor-pointer ${DM_STATUS_TEXT[p.dm_status]}`}>
                        {(Object.keys(DM_STATUS_LABEL) as DmStatus[]).map(s => (
                          <option key={s} value={s} className="text-[#1E1B4B]">{DM_STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-xs whitespace-nowrap">
                      {p.next_followup_at ? (
                        <span className={p.next_followup_at <= localDay(new Date()) ? 'text-[#b45309] font-semibold' : 'text-[#6B6B8A]'}>
                          {new Date(p.next_followup_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      ) : <span className="text-[#9CA3AF]">-</span>}
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
                      <button onClick={e => {
                        if (menuId === p.id) { setMenuId(null); return }
                        const rect = e.currentTarget.getBoundingClientRect()
                        setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
                        setMenuId(p.id)
                      }} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#9CA3AF] transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action menu dropdown (fixed positioned, escapes table's overflow clipping) */}
      {menuId && menuPos && (() => {
        const p = prospects.find(x => x.id === menuId)
        if (!p) return null
        return (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuId(null)} />
            <div className="fixed z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 w-44" style={{ top: menuPos.top, right: menuPos.right }}>
              <button onClick={() => copyDm(p)}
                className="w-full text-left px-4 py-2 text-xs text-[#7C6FCD] font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                <MessageSquare size={12} /> Salin DM
              </button>
              <a href={`https://instagram.com/${p.username_ig}`} target="_blank" rel="noopener noreferrer"
                onClick={() => setMenuId(null)}
                className="w-full text-left px-4 py-2 text-xs text-[#1E1B4B] hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                <ExternalLink size={12} /> Buka IG
              </a>
              <div className="border-t border-gray-100 my-1.5" />
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
        )
      })()}

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

            <button onClick={() => copyDm(detailTarget)}
              className="w-full mb-4 py-2.5 rounded-xl border border-[#7C6FCD]/30 bg-[#f5f3ff] text-[#7C6FCD] text-sm font-bold hover:bg-[#ede9fe] transition-colors flex items-center justify-center gap-2">
              {copiedId === detailTarget.id
                ? <><Check size={14} /> Tersalin!</>
                : <><MessageSquare size={14} /> Salin DM buat @{detailTarget.username_ig}</>}
            </button>

            <div className="flex flex-col gap-3 mb-4">
              <TimelineRow label="Created" date={detailTarget.created_at} />
              <TimelineRow label="DM Sent" date={detailTarget.dm_sent_at} />
              <TimelineRow label="Kontak Terakhir" date={detailTarget.last_contact_at} />
              <TimelineRow label="Follow-up Berikutnya" date={detailTarget.next_followup_at} />
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
