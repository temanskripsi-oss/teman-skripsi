import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User, Mail, Shield } from 'lucide-react'
import ProfilePhotoUpload from '@/components/profile/ProfilePhotoUpload'

export default async function AdminProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const fields = [
    { icon: User,   label: 'Nama Lengkap', value: profile?.full_name ?? '—' },
    { icon: Mail,   label: 'Email',         value: user.email ?? '—' },
    { icon: Shield, label: 'Role',          value: 'Admin' },
  ]

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Profil Admin</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Informasi akun admin kamu.</p>
      </div>

      {/* Avatar card */}
      <div className="flex items-center gap-5 mb-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <ProfilePhotoUpload
          userId={user.id}
          currentUrl={profile?.avatar_url ?? null}
          name={profile?.full_name ?? user.email ?? 'A'}
        />
        <div>
          <p className="text-[#1E1B4B] font-bold text-lg">{profile?.full_name ?? 'Admin'}</p>
          <p className="text-[#9CA3AF] text-sm">{user.email}</p>
          <span className="inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20">
            Admin
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
