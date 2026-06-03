import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

const PRODUCT_LABELS: Record<string, string> = {
  fastrack:               'Fastrack',
  'mentoring-sempro':     'Mentoring Sempro',
  'mentoring-penelitian': 'Mentoring Penelitian',
  all:                    'All Access',
}

const CAPACITY: Record<string, number> = {
  fastrack:               10,
  'mentoring-sempro':     5,
  'mentoring-penelitian': 5,
}

export default async function MentorOverviewPage() {
  const supabase  = await createClient()
  const service   = createServiceClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: mentorProfile } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
  if (mentorProfile?.role !== 'mentor') redirect('/dashboard')

  const { data: clients } = await service
    .from('profiles')
    .select('id, full_name, university, product, active_until, created_at')
    .eq('mentor_id', user.id)
    .eq('role', 'user')
    .order('created_at', { ascending: false })

  const now = new Date()

  const grouped: Record<string, typeof clients> = {}
  clients?.forEach(c => {
    const p = c.product ?? 'fastrack'
    if (!grouped[p]) grouped[p] = []
    grouped[p]!.push(c)
  })

  const totalClients = clients?.length ?? 0

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Mentor Panel</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Halo, {mentorProfile?.full_name?.split(' ')[0] ?? 'Mentor'}!</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Pantau perkembangan semua klienmu di sini.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="p-2.5 rounded-xl w-fit mb-3 bg-[#eff6ff] text-[#2232dd]">
            <Users size={18} />
          </div>
          <p className="text-2xl font-bold text-[#1E1B4B] mb-0.5">{totalClients}</p>
          <p className="text-[#9CA3AF] text-xs">Total Klien Aktif</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="p-2.5 rounded-xl w-fit mb-3 bg-green-50 text-green-600">
            <CheckCircle size={18} />
          </div>
          <p className="text-2xl font-bold text-[#1E1B4B] mb-0.5">
            {clients?.filter(c => new Date(c.active_until) >= now).length ?? 0}
          </p>
          <p className="text-[#9CA3AF] text-xs">Klien Masih Aktif</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="p-2.5 rounded-xl w-fit mb-3 bg-orange-50 text-orange-500">
            <Clock size={18} />
          </div>
          <p className="text-2xl font-bold text-[#1E1B4B] mb-0.5">
            {clients?.filter(c => new Date(c.active_until) < now).length ?? 0}
          </p>
          <p className="text-[#9CA3AF] text-xs">Sudah Berakhir</p>
        </div>
      </div>

      {/* Per produk */}
      <div className="flex flex-col gap-6">
        {Object.entries(grouped).map(([product, pClients]) => {
          const cap = CAPACITY[product] ?? 10
          const pct = Math.min(100, Math.round(((pClients?.length ?? 0) / cap) * 100))
          const full = (pClients?.length ?? 0) >= cap

          return (
            <div key={product} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#1E1B4B] text-sm">{PRODUCT_LABELS[product] ?? product}</h2>
                  <p className="text-[#9CA3AF] text-xs mt-0.5">
                    {pClients?.length ?? 0} / {cap} klien
                    {product === 'fastrack' ? ' · Durasi 1 bulan' : ' · Durasi 3 bulan · 9 sesi'}
                  </p>
                </div>
                {full && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
                    <AlertTriangle size={11} /> Kapasitas Penuh
                  </span>
                )}
              </div>

              {/* Capacity bar */}
              <div className="px-6 py-3 border-b border-gray-50">
                <div className="h-2 bg-[#f4f8ff] rounded-full overflow-hidden border border-gray-100">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: full ? '#f97316' : 'linear-gradient(90deg,#2232dd,#4DD9C0)' }} />
                </div>
              </div>

              {/* Client list */}
              {!pClients || pClients.length === 0 ? (
                <p className="text-center text-[#9CA3AF] text-sm py-8">Belum ada klien untuk produk ini</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {pClients.map(c => {
                    const expired = new Date(c.active_until) < now
                    const daysLeft = Math.ceil((new Date(c.active_until).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

                    return (
                      <Link key={c.id} href={`/mentor/clients/${c.id}`}
                        className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#f4f8ff] transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.full_name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1E1B4B] text-sm truncate">{c.full_name}</p>
                          <p className="text-[#9CA3AF] text-xs">{c.university}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {expired ? (
                            <span className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                              Berakhir
                            </span>
                          ) : (
                            <span className="text-xs text-[#9CA3AF]">{daysLeft} hari lagi</span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {totalClients === 0 && (
          <div className="bg-white rounded-2xl p-14 text-center border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-[#2232dd]" />
            </div>
            <p className="font-semibold text-[#1E1B4B] text-sm mb-1">Belum ada klien</p>
            <p className="text-[#9CA3AF] text-xs">Admin akan mengassign klien kepadamu</p>
          </div>
        )}
      </div>
    </div>
  )
}
