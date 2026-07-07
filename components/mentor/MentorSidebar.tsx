'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Home, Users, LogOut, User, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const nav = [
  { href: '/mentor',         icon: Home,  label: 'Overview' },
  { href: '/mentor/clients', icon: Users, label: 'Klien Saya' },
  { href: '/mentor/profile', icon: User,  label: 'Profil' },
]

export default function MentorSidebar() {
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
      {nav.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href !== '/mentor' && pathname.startsWith(href))
        return (
          <Link key={href} href={href} onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              active ? 'bg-[#2232dd] text-white shadow-sm shadow-[#2232dd]/20' : 'text-[#6B6B8A] hover:text-[#1E1B4B] hover:bg-[#f4f8ff]'
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
      <aside className="hidden md:flex w-60 flex-shrink-0 bg-white border-r border-gray-100 min-h-screen flex-col shadow-sm">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="inline-flex items-center gap-2.5 cursor-pointer">
            <Image src="/images/logo.png" alt="Teman Skripsi" width={32} height={32} className="flex-shrink-0 rounded-xl" />
            <span className="font-bold text-base tracking-tight text-[#1E1B4B]">Teman <span className="text-[#2232dd]">Skripsi</span></span>
          </Link>
          <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-widest mt-2 px-0.5">Mentor Panel</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-0.5">
          <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase tracking-widest px-3 py-2 mt-1">Menu</p>
          <NavLinks />
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 w-full transition-all cursor-pointer">
            <LogOut size={16} />Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Teman Skripsi" width={28} height={28} className="rounded-lg" />
          <div>
            <p className="font-bold text-sm text-[#1E1B4B] leading-none">Teman <span className="text-[#2232dd]">Skripsi</span></p>
            <p className="text-[9px] text-[#9CA3AF]">Mentor Panel</p>
          </div>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer">
          <Menu size={20} className="text-[#1E1B4B]" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Image src="/images/logo.png" alt="Teman Skripsi" width={28} height={28} className="rounded-lg" />
                <span className="font-bold text-sm text-[#1E1B4B]">Teman <span className="text-[#2232dd]">Skripsi</span></span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                <X size={18} className="text-[#9CA3AF]" />
              </button>
            </div>
            <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
              <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase tracking-widest px-3 py-2 mt-1">Menu</p>
              <NavLinks onClick={() => setMobileOpen(false)} />
            </nav>
            <div className="p-3 border-t border-gray-100">
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 w-full cursor-pointer">
                <LogOut size={16} />Keluar
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
