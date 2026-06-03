'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Home, Video, Gift, Calendar, User, LogOut, FileText, ClipboardList, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'

const isMentoringPrivat = (p: Product) => p === 'mentoring-sempro' || p === 'mentoring-penelitian'

export default function Sidebar({ product }: { product: Product }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const isPrivat = isMentoringPrivat(product)

  const nav = [
    { href: '/dashboard',            icon: Home,          label: 'Beranda',           show: true },
    { href: '/dashboard/videos',     icon: Video,         label: 'Video Materi',      show: true },
    { href: '/dashboard/freebies',   icon: Gift,          label: 'Template & Freebies', show: true },
    { href: '/dashboard/schedule',   icon: Calendar,      label: 'Jadwal Bimbingan',  show: true },
    { href: '/dashboard/tasks',      icon: ClipboardList, label: 'Tugas Mingguan',    show: !isPrivat },
    { href: '/dashboard/feedback',   icon: FileText,      label: 'Written Feedback',  show: !isPrivat },
    { href: '/dashboard/progress',   icon: BookOpen,      label: 'Progress Bimbingan',show: isPrivat },
    { href: '/dashboard/profile',    icon: User,          label: 'Profil',            show: true },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-100 min-h-screen flex flex-col shadow-sm">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="inline-flex items-center gap-2.5 cursor-pointer">
          <Image src="/images/logo.png" alt="TemanSkripsi" width={32} height={32} className="flex-shrink-0 rounded-xl" />
          <span className="font-bold text-base tracking-tight text-[#1E1B4B]">
            Teman<span className="text-[#2232dd]">Skripsi</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase tracking-widest px-3 py-2 mt-1">Menu</p>
        {nav.filter(n => n.show).map(({ href, icon: Icon, label }) => {
          const active = pathname === href
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

      {/* Logout */}
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
