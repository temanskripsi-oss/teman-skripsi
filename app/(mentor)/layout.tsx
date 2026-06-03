import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MentorSidebar from '@/components/mentor/MentorSidebar'

export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'mentor') redirect('/dashboard')

  return (
    <div className="flex min-h-screen bg-[#f4f8ff]">
      <MentorSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
