'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Users, LogOut, GraduationCap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const nav = [
  { href: '/mentor',         icon: Home,  label: 'Overview' },
  { href: '/mentor/clients', icon: Users, label: 'Klien Saya' },
]

export default function MentorSidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-100 min-h-screen flex flex-col shadow-sm">
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="inline-flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] flex items-center justify-center flex-shrink-0">
            <GraduationCap size={14} className="text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-[#1E1B4B]">
            Teman<span className="text-[#2232dd]">Skripsi</span>
          </span>
        </Link>
        <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-widest mt-2 px-0.5">Mentor Panel</p>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase tracking-widest px-3 py-2 mt-1">Menu</p>
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/mentor' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                active
                  ? 'bg-[#2232dd] text-white shadow-sm shadow-[#2232dd]/20'
                  : 'text-[#6B6B8A] hover:text-[#1E1B4B] hover:bg-[#f4f8ff]'
              }`}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 w-full transition-all duration-200 cursor-pointer">
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </aside>
  )
}
