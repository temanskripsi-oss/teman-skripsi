import { createServiceClient } from '@/lib/supabase/service'
import ContentManager from '@/components/admin/ContentManager'
import type { Video, Freebie, Task } from '@/types'

export default async function AdminContentPage() {
  const supabase = createServiceClient()

  const [{ data: videos }, { data: freebies }, { data: tasks }, { data: weekConfigs }] = await Promise.all([
    supabase.from('videos').select('*').order('week_number', { ascending: true }).order('order_index', { ascending: true }),
    supabase.from('freebies').select('*').order('order_index', { ascending: true }),
    supabase.from('tasks').select('*').order('week_number', { ascending: true }).order('order_index', { ascending: true }),
    supabase.from('week_configs').select('week_number, title, product'),
  ])

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Konten</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Kelola video materi, template freebies, dan tugas mingguan</p>
      </div>
      <ContentManager
        videos={(videos ?? []) as Video[]}
        freebies={(freebies ?? []) as Freebie[]}
        tasks={(tasks ?? []) as Task[]}
        weekConfigs={(weekConfigs ?? []) as { week_number: number; title: string; product: string }[]}
      />
    </div>
  )
}
