import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, product').eq('id', user.id).single()

  if (!profile) {
    redirect('/auth/signout-unregistered')
  }

  const product = profile.product ?? 'fastrack'

  return (
    <div className="flex min-h-screen bg-[#f4f8ff]">
      <Sidebar product={product} />
      <main className="flex-1 overflow-auto pt-14 md:pt-0">{children}</main>
    </div>
  )
}
