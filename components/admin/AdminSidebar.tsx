'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { LayoutDashboard, Users, FileText, DollarSign, LogOut, Globe, UserCheck, ClipboardList, User, BarChart2, Menu, X, Megaphone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const nav = [
  { href: '/admin',               icon: LayoutDashboard, label: 'Overview',     exact: true },
  { href: '/admin/clients',       icon: Users,           label: 'Klien',        exact: false },
  { href: '/admin/mentors',       icon: UserCheck,       label: 'Mentor',       exact: false },
  { href: '/admin/content',       icon: FileText,        label: 'Konten',       exact: false },
  { href: '/admin/rekap',         icon: BarChart2,       label: 'Rekap Batch',  exact: false },
  { href: '/admin/revenue',       icon: DollarSign,      label: 'Revenue',      exact: false },
  { href: '/admin/registrations', icon: ClipboardList,   label: 'Registrasi',   exact: false },
  { href: '/admin/sales-team',    icon: Megaphone,       label: 'Sales Team',   exact: false },
  { href: '/admin/profile',       icon: User,            label: 'Profil',       exact: false },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {nav.map(({ href, icon: Icon, label, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link key={href} href={href} onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              active ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}>
            <Icon size={16} />{label}
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-shrink-0 bg-[#1E1B4B] min-h-screen flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="inline-flex items-center gap-2.5 cursor-pointer">
            <Image src="/images/logo.png" alt="TemanSkripsi" width={32} height={32} className="flex-shrink-0 rounded-xl" />
            <div>
              <p className="font-bold text-base tracking-tight text-white leading-none">Teman<span className="text-[#4DD9C0]">Skripsi</span></p>
              <p className="text-[10px] text-white/40 mt-0.5">Admin Panel</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 py-2 mt-1">Menu</p>
          <NavLinks />
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 py-2 mt-4">Lainnya</p>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
            <Globe size={16} />Lihat Website
          </Link>
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 w-full transition-all cursor-pointer">
            <LogOut size={16} />Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#1E1B4B] px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="TemanSkripsi" width={28} height={28} className="rounded-lg" />
          <div>
            <p className="font-bold text-sm text-white leading-none">Teman<span className="text-[#4DD9C0]">Skripsi</span></p>
            <p className="text-[9px] text-white/40">Admin Panel</p>
          </div>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl hover:bg-white/10 cursor-pointer">
          <Menu size={20} className="text-white" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-[#1E1B4B] h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Image src="/images/logo.png" alt="TemanSkripsi" width={28} height={28} className="rounded-lg" />
                <p className="font-bold text-sm text-white">Teman<span className="text-[#4DD9C0]">Skripsi</span></p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer">
                <X size={18} className="text-white/60" />
              </button>
            </div>
            <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
              <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 py-2 mt-1">Menu</p>
              <NavLinks onClick={() => setMobileOpen(false)} />
              <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 py-2 mt-4">Lainnya</p>
              <Link href="/" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 cursor-pointer">
                <Globe size={16} />Lihat Website
              </Link>
            </nav>
            <div className="p-3 border-t border-white/10">
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 w-full cursor-pointer">
                <LogOut size={16} />Keluar
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
