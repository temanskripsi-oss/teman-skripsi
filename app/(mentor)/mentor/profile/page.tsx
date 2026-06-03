import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { User, Mail, GraduationCap, Users } from 'lucide-react'
import ProfilePhotoUpload from '@/components/profile/ProfilePhotoUpload'

export default async function MentorProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const service = createServiceClient()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const { count: clientCount } = await service
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('mentor_id', user.id)
    .eq('role', 'user')

  const fields = [
    { icon: User,          label: 'Nama Lengkap',  value: profile?.full_name ?? '—' },
    { icon: Mail,          label: 'Email',          value: user.email ?? '—' },
    { icon: GraduationCap, label: 'Universitas',    value: profile?.university ?? '—' },
    { icon: Users,         label: 'Jumlah Klien',  value: `${clientCount ?? 0} klien aktif` },
  ]

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Mentor Panel</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Profil Mentor</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Informasi akun mentor kamu.</p>
      </div>

      {/* Avatar card */}
      <div className="flex items-center gap-5 mb-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <ProfilePhotoUpload
          userId={user.id}
          currentUrl={profile?.avatar_url ?? null}
          name={profile?.full_name ?? user.email ?? 'M'}
        />
        <div>
          <p className="text-[#1E1B4B] font-bold text-lg">{profile?.full_name ?? 'Mentor'}</p>
          <p className="text-[#9CA3AF] text-sm">{user.email}</p>
          <span className="inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f5f3ff] text-[#7C6FCD] border border-[#7C6FCD]/20">
            Mentor
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-sm overflow-hidden">
        {fields.map((field, i) => {
          const Icon = field.icon
          return (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="p-2 bg-[#f5f3ff] text-[#7C6FCD] rounded-lg flex-shrink-0">
                <Icon size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#9CA3AF] text-xs mb-0.5">{field.label}</p>
                <p className="text-[#1E1B4B] font-medium text-sm truncate">{field.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-[#9CA3AF] text-xs mt-4 text-center">
        Info kontak WA hanya terlihat oleh admin.
      </p>
    </div>
  )
}
