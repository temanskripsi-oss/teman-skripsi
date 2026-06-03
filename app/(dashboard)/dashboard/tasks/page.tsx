import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TasksClient from '@/components/dashboard/TasksClient'
import type { Task, TaskSubmission } from '@/types'

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('product, start_date').eq('id', user.id).single()

  const [{ data: tasks }, { data: subs }] = await Promise.all([
    supabase.from('tasks').select('*')
      .eq('product', profile?.product ?? 'fastrack')
      .order('week_number', { ascending: true })
      .order('order_index', { ascending: true }),
    supabase.from('task_submissions').select('*').eq('user_id', user.id),
  ])

  const submissionsMap: Record<string, TaskSubmission> = {}
  subs?.forEach(s => { submissionsMap[s.task_id] = s as TaskSubmission })

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Tugas Mingguan</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Kumpulkan output tugas setiap minggu untuk dicek mentor.</p>
      </div>
      <TasksClient
        tasks={(tasks ?? []) as Task[]}
        submissionsMap={submissionsMap}
        startDate={profile?.start_date ?? null}
      />
    </div>
  )
}
