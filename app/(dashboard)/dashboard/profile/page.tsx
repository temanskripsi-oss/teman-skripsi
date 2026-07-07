import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User, GraduationCap, Package, Calendar, Mail } from 'lucide-react'
import ProfilePhotoUpload from '@/components/profile/ProfilePhotoUpload'

const productLabels: Record<string, string> = {
  'fastrack':             'Fast Track Sempro 30 Hari',
  'mentoring-sempro':     'Mentoring Privat Sempro',
  'mentoring-penelitian': 'Mentoring Privat Sidang Akhir',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const activeUntil = profile?.active_until
    ? new Date(profile.active_until).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const isExpired = profile?.active_until ? new Date(profile.active_until) < new Date() : false

  const fields = [
    { icon: User,          label: 'Nama Lengkap', value: profile?.full_name ?? '—' },
    { icon: Mail,          label: 'Email',         value: user.email ?? '—' },
    { icon: GraduationCap, label: 'Universitas',   value: profile?.university ?? '—' },
    { icon: Package,       label: 'Program',       value: profile?.product ? (productLabels[profile.product] ?? profile.product) : '—' },
    {
      icon: Calendar, label: 'Masa Aktif', value: activeUntil ?? '—',
      badge: isExpired
        ? { label: 'Expired', cls: 'bg-red-50 text-red-500 border border-red-100' }
        : activeUntil
          ? { label: 'Aktif', cls: 'bg-green-50 text-[#16a34a] border border-green-100' }
          : null,
    },
  ]

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Profil</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Informasi akun dan program kamu.</p>
      </div>

      {/* Avatar + info card */}
      <div className="flex items-center gap-5 mb-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <ProfilePhotoUpload
          userId={user.id}
          currentUrl={profile?.avatar_url ?? null}
          name={profile?.full_name ?? user.email ?? 'U'}
        />
        <div>
          <p className="text-[#1E1B4B] font-bold text-lg">{profile?.full_name ?? 'Client'}</p>
          <p className="text-[#9CA3AF] text-sm">{user.email}</p>
          <span className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
            isExpired ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-[#16a34a] border-green-100'
          }`}>
            {isExpired ? 'Expired' : 'Aktif'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-sm overflow-hidden">
        {fields.map((field, i) => {
          const Icon = field.icon
          return (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="p-2 bg-[#eff6ff] text-[#2232dd] rounded-lg flex-shrink-0">
                <Icon size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#9CA3AF] text-xs mb-0.5">{field.label}</p>
                <p className="text-[#1E1B4B] font-medium text-sm truncate">{field.value}</p>
              </div>
              {field.badge && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${field.badge.cls}`}>
                  {field.badge.label}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-[#9CA3AF] text-xs mt-6 text-center">
        Perlu update data? Hubungi kami via{' '}
        <a href="https://wa.me/6289524785477" target="_blank" rel="noopener noreferrer" className="text-[#2232dd] hover:underline cursor-pointer">
          WhatsApp
        </a>
      </p>
    </div>
  )
}
