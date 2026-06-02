import { createServiceClient } from '@/lib/supabase/service'
import ClientsTable from '@/components/admin/ClientsTable'
import type { Profile } from '@/types'

export default async function AdminClientsPage() {
  const supabase = createServiceClient()
  const { data: clients } = await supabase
    .from('profiles')
    .select('*')
    .neq('role', 'admin')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Klien</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Kelola semua klien TemanSkripsi</p>
      </div>
      <ClientsTable clients={(clients ?? []) as Profile[]} />
    </div>
  )
}
