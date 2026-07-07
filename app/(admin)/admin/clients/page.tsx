import { createServiceClient } from '@/lib/supabase/service'
import ClientsTable from '@/components/admin/ClientsTable'
import GhostAccountsCleaner from '@/components/admin/GhostAccountsCleaner'
import type { Profile } from '@/types'

export default async function AdminClientsPage() {
  const supabase = createServiceClient()

  const [{ data: clients }, { data: mentors }] = await Promise.all([
    supabase.from('profiles').select('*').eq('role', 'user').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, full_name').eq('role', 'mentor').order('full_name', { ascending: true }),
  ])

  const { data: allProfiles } = await supabase.from('profiles').select('id')
  const { data: listUsersData } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const authUsers = listUsersData?.users ?? []

  const knownIds = new Set((allProfiles ?? []).map((p: { id: string }) => p.id))
  const ghostAccounts = authUsers
    .filter(u => !knownIds.has(u.id))
    .map(u => ({ id: u.id, email: u.email ?? '(no email)', created_at: u.created_at }))

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Klien</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Kelola semua klien Teman Skripsi</p>
      </div>
      {ghostAccounts.length > 0 && (
        <GhostAccountsCleaner ghosts={ghostAccounts} />
      )}
      <ClientsTable
        clients={(clients ?? []) as Profile[]}
        mentors={(mentors ?? []) as { id: string; full_name: string }[]}
      />
    </div>
  )
}
