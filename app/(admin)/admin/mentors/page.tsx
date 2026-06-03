import { createServiceClient } from '@/lib/supabase/service'
import MentorsTable from '@/components/admin/MentorsTable'

export default async function AdminMentorsPage() {
  const supabase = createServiceClient()

  const [{ data: mentorProfiles }, { data: clients }] = await Promise.all([
    supabase.from('profiles').select('id, full_name, phone, avatar_url').eq('role', 'mentor').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, mentor_id').eq('role', 'user').not('mentor_id', 'is', null),
  ])

  // Get emails for each mentor
  const mentors = await Promise.all(
    (mentorProfiles ?? []).map(async m => {
      const { data: userData } = await supabase.auth.admin.getUserById(m.id)
      const clientCount = clients?.filter(c => c.mentor_id === m.id).length ?? 0
      return {
        id: m.id,
        full_name: m.full_name ?? '',
        phone: m.phone ?? '',
        email: userData?.user?.email ?? '',
        avatar_url: (m as { avatar_url?: string }).avatar_url ?? null,
        clientCount,
      }
    })
  )

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Mentor</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Kelola akun mentor dan lihat jumlah klien mereka</p>
      </div>
      <MentorsTable mentors={mentors} />
    </div>
  )
}
