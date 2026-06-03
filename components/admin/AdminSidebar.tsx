'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { LayoutDashboard, Users, FileText, DollarSign, LogOut, Globe, UserCheck, ClipboardList } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const nav = [
  { href: '/admin',         icon: LayoutDashboard, label: 'Overview',  exact: true },
  { href: '/admin/clients', icon: Users,            label: 'Klien',     exact: false },
  { href: '/admin/mentors', icon: UserCheck,        label: 'Mentor',    exact: false },
  { href: '/admin/content', icon: FileText,         label: 'Konten',    exact: false },
  { href: '/admin/revenue',       icon: DollarSign,     label: 'Revenue',      exact: false },
  { href: '/admin/registrations', icon: ClipboardList,  label: 'Registrasi',   exact: false },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-[#1E1B4B] min-h-screen flex flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/" className="inline-flex items-center gap-2.5 cursor-pointer">
          <Image src="/images/logo.png" alt="TemanSkripsi" width={32} height={32} className="flex-shrink-0" />
          <div>
            <p className="font-bold text-base tracking-tight text-white leading-none">
              Teman<span className="text-[#4DD9C0]">Skripsi</span>
            </p>
            <p className="text-[10px] text-white/40 mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 py-2 mt-1">Menu</p>
        {nav.map(({ href, icon: Icon, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}

        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 py-2 mt-4">Lainnya</p>
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer">
          <Globe size={16} />
          Lihat Website
        </Link>
      </nav>

      <div className="p-3 border-t border-white/10">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 w-full transition-all duration-200 cursor-pointer">
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </aside>
  )
}
