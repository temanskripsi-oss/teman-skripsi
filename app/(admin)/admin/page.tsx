import { createServiceClient } from '@/lib/supabase/service'
import { Users, Calendar, DollarSign, TrendingUp, BarChart2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function AdminOverview() {
  const supabase = createServiceClient()

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const firstOfMonthDate = firstOfMonth.split('T')[0]
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()

  const [
    { count: totalClients },
    { data: todaySessions },
    { data: revenueData },
    { data: recentClients },
    { count: newClientsThisMonth },
    { data: fastrackBatch },
    { data: privatBatch },
    { data: sessionsBatch },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
    supabase.from('sessions').select('*, profiles!sessions_user_id_fkey(full_name)').gte('scheduled_at', today).lt('scheduled_at', tomorrow).eq('status', 'upcoming'),
    supabase.from('payments').select('amount').eq('status', 'paid').gte('payment_date', firstOfMonthDate),
    supabase.from('profiles').select('id, full_name, university, product, active_until, created_at, avatar_url').eq('role', 'user').order('created_at', { ascending: false }).limit(5),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user').gte('created_at', firstOfMonth),
    // Fastrack batch bulan ini
    supabase.from('profiles').select('id').eq('role', 'user').eq('product', 'fastrack')
      .gte('start_date', firstOfMonthDate)
      .lt('start_date', new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().split('T')[0]),
    // Privat batch bulan ini
    supabase.from('profiles').select('id').eq('role', 'user').in('product', ['mentoring-sempro', 'mentoring-penelitian'])
      .gte('start_date', firstOfMonthDate)
      .lt('start_date', new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().split('T')[0]),
    // Sesi selesai bulan ini
    supabase.from('sessions').select('id').eq('status', 'done').gte('scheduled_at', firstOfMonth),
  ])

  const revenueThisMonth = revenueData?.reduce((s, p) => s + p.amount, 0) ?? 0
  const fmt = (n: number) => `Rp ${(n / 1_000_000).toFixed(1)}jt`
  const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']

  const stats = [
    { label: 'Total Klien',    value: String(totalClients ?? 0),     icon: Users,      color: '#2232dd', bg: '#eff6ff' },
    { label: 'Sesi Hari Ini',  value: String(todaySessions?.length ?? 0), icon: Calendar, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Revenue Bulan Ini', value: fmt(revenueThisMonth),      icon: DollarSign, color: '#7C6FCD', bg: '#f5f3ff' },
    { label: 'Klien Baru',     value: String(newClientsThisMonth ?? 0), icon: TrendingUp, color: '#ea580c', bg: '#fff7ed' },
  ]

  const PRODUCT_LABELS: Record<string, string> = {
    fastrack: 'Fastrack',
    'mentoring-sempro': 'Sempro',
    'mentoring-penelitian': 'Penelitian',
    all: 'All Access',
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Overview</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Ringkasan aktivitas Teman Skripsi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="p-2.5 rounded-xl w-fit mb-3" style={{ background: s.bg, color: s.color }}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-[#1E1B4B] mb-0.5">{s.value}</p>
              <p className="text-[#9CA3AF] text-xs">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Rekap Batch Bulan Ini */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#f5f3ff]"><BarChart2 size={15} className="text-[#7C6FCD]" /></div>
            <div>
              <p className="font-semibold text-[#1E1B4B] text-sm">Rekap Batch {MONTHS[now.getMonth()]} {now.getFullYear()}</p>
              <p className="text-[#9CA3AF] text-xs">Real-time bulan berjalan</p>
            </div>
          </div>
          <Link href="/admin/rekap" className="flex items-center gap-1 text-xs text-[#7C6FCD] font-medium hover:underline">
            Lihat detail <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#eff6ff] rounded-xl px-4 py-3 text-center">
            <p className="text-xl font-bold text-[#2232dd]">{fastrackBatch?.length ?? 0}</p>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5">Peserta Fastrack</p>
          </div>
          <div className="bg-[#f5f3ff] rounded-xl px-4 py-3 text-center">
            <p className="text-xl font-bold text-[#7C6FCD]">{privatBatch?.length ?? 0}</p>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5">Klien Privat</p>
          </div>
          <div className="bg-[#f0fdf4] rounded-xl px-4 py-3 text-center">
            <p className="text-xl font-bold text-green-600">{sessionsBatch?.length ?? 0}</p>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5">Sesi Selesai</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-[#1E1B4B] text-sm">Klien Terbaru</h2>
            <Link href="/admin/clients" className="text-[#2232dd] text-xs font-medium hover:underline">Lihat semua</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {!recentClients || recentClients.length === 0 ? (
              <p className="text-center text-[#9CA3AF] text-sm py-10">Belum ada klien</p>
            ) : recentClients.map(c => (
              <Link key={c.id} href={`/admin/clients/${c.id}`}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#f4f8ff] transition-colors cursor-pointer">
                {c.avatar_url ? (
                  <Image src={c.avatar_url} alt={c.full_name} width={32} height={32}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {c.full_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1E1B4B] text-sm truncate">{c.full_name}</p>
                  <p className="text-[#9CA3AF] text-xs">{c.university}</p>
                </div>
                <span className="text-xs bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20 px-2.5 py-1 rounded-full font-medium flex-shrink-0">
                  {PRODUCT_LABELS[c.product] ?? c.product}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Today Sessions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-[#1E1B4B] text-sm">Sesi Hari Ini</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {!todaySessions || todaySessions.length === 0 ? (
              <p className="text-center text-[#9CA3AF] text-sm py-10">Tidak ada sesi hari ini</p>
            ) : todaySessions.map(s => (
              <div key={s.id} className="px-6 py-3.5 flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-[#1E1B4B] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {s.session_number}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1E1B4B] text-sm">{(s as Record<string, unknown> & { profiles?: { full_name?: string } }).profiles?.full_name ?? '-'}</p>
                  <p className="text-[#9CA3AF] text-xs">
                    {new Date(s.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB · {s.session_type}
                  </p>
                </div>
                {s.zoom_link && (
                  <a href={s.zoom_link} target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-[#2232dd] text-white px-3 py-1 rounded-lg font-medium flex-shrink-0 hover:bg-[#1a28b8] transition-colors">
                    Zoom
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
