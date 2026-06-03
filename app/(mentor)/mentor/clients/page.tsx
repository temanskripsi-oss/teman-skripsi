import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

const PRODUCT_LABELS: Record<string, string> = {
  fastrack:               'Fastrack',
  'mentoring-sempro':     'Mentoring Sempro',
  'mentoring-penelitian': 'Mentoring Penelitian',
  all:                    'All Access',
}

export default async function MentorClientsPage() {
  const supabase = await createClient()
  const service  = createServiceClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: clients } = await service
    .from('profiles')
    .select('id, full_name, university, product, active_until, created_at, avatar_url')
    .eq('mentor_id', user.id)
    .eq('role', 'user')
    .order('created_at', { ascending: false })

  const now = new Date()

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Mentor Panel</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Klien Saya</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">{clients?.length ?? 0} klien ter-assign</p>
      </div>

      {!clients || clients.length === 0 ? (
        <div className="bg-white rounded-2xl p-14 text-center border border-gray-100 shadow-sm">
          <p className="text-[#9CA3AF] text-sm">Belum ada klien yang di-assign ke kamu.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {clients.map(c => {
              const expired = new Date(c.active_until) < now
              const daysLeft = Math.ceil((new Date(c.active_until).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              return (
                <Link key={c.id} href={`/mentor/clients/${c.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#f4f8ff] transition-colors cursor-pointer">
                  {c.avatar_url ? (
                    <Image src={c.avatar_url} alt={c.full_name} width={36} height={36}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {c.full_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1E1B4B] text-sm">{c.full_name}</p>
                    <p className="text-[#9CA3AF] text-xs">{c.university}</p>
                  </div>
                  <span className="text-xs bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20 px-2.5 py-1 rounded-full font-medium flex-shrink-0">
                    {PRODUCT_LABELS[c.product] ?? c.product}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${expired ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                    {expired ? 'Berakhir' : `${daysLeft}h lagi`}
                  </span>
                  <ChevronRight size={15} className="text-[#9CA3AF] flex-shrink-0" />
                </Link>
              )
            })}
          </div>
          <div className="px-6 py-3 border-t border-gray-50">
            <p className="text-[#9CA3AF] text-xs">{clients.length} klien</p>
          </div>
        </div>
      )}
    </div>
  )
}
