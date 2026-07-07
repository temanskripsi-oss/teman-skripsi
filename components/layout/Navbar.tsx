'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useHideOnScroll } from '@/hooks/useHideOnScroll'
import { createClient } from '@/lib/supabase/client'

const PROGRAM_LINKS = [
  { href: '/fastrack', label: 'Fast Track Sempro', desc: 'Fastrack Proposal Skripsi', badge: 'Terlaris', badgeColor: '#16a34a', badgeBg: '#f0fdf4' },
  { href: '/mentoring-sempro', label: 'Mentoring Privat Sempro', desc: 'Bimbingan 1-on-1 sampai ACC Sempro', badge: 'Populer', badgeColor: '#2232dd', badgeBg: '#eff6ff' },
  { href: '/mentoring-penelitian', label: 'Mentoring Privat Bab 4–5', desc: 'Analisis data sampai sidang' },
]

const WHY_LINKS = [
  { href: '/#cara-kerja', label: 'Cara Kerja', desc: 'Tiga langkah menuju wisuda' },
  { href: '/#alumni', label: 'Alumni', desc: 'Cerita mahasiswa yang sudah lulus' },
  { href: '/#testimoni', label: 'Testimoni', desc: 'Kata mereka soal Teman Skripsi' },
]

function Dropdown({ label, items, onNavigate }: { label: string; items: typeof PROGRAM_LINKS; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-white/60 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/8 cursor-pointer">
        {label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50">
          {items.map(item => (
            <Link key={item.href} href={item.href} onClick={() => { setOpen(false); onNavigate?.() }}
              className="block px-4 py-3 rounded-xl hover:bg-[#f4f8ff] transition-colors cursor-pointer">
              <div className="flex items-center gap-2">
                <p className="text-[#1E1B4B] text-sm font-semibold">{item.label}</p>
                {'badge' in item && item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ color: item.badgeColor, background: item.badgeBg }}>
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-[#9CA3AF] text-xs mt-0.5">{item.desc}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const hidden = useHideOnScroll()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setLoggedIn(!!session))
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <nav className={`fixed z-50 left-0 right-0 transition-all duration-500 bg-[#1E1B4B]/95 backdrop-blur-xl ${hidden && !menuOpen ? '-translate-y-[calc(100%+2rem)]' : 'translate-y-0'} ${
      scrolled
        ? 'top-3 mx-4 sm:mx-8 rounded-2xl shadow-2xl shadow-black/30 border border-white/10'
        : 'top-0 border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <Image src="/images/logo.png" alt="Teman Skripsi" width={32} height={32} className="flex-shrink-0 rounded-xl" />
            <span className="text-white font-bold text-lg tracking-tight">
              Teman <span className="text-[#9eff63]">Skripsi</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="text-white/60 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/8 cursor-pointer">
              Home
            </Link>
            <Dropdown label="Program" items={PROGRAM_LINKS} />
            <Dropdown label="Kenapa Kami" items={WHY_LINKS} />
            <Link href="/#faq" className="text-white/60 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/8 cursor-pointer">
              FAQ
            </Link>
            {loggedIn && (
              <Link href="/dashboard" className="text-white/60 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/8 cursor-pointer">
                Dashboard
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {loggedIn ? (
              <Link href="/dashboard"
                className="bg-[#2232dd] hover:bg-[#3d4fe8] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#2232dd]/30 cursor-pointer">
                Ke Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-white/60 hover:text-white text-sm font-medium transition-colors cursor-pointer">
                  Masuk
                </Link>
                <Link href="/#produk"
                  className="bg-[#2232dd] hover:bg-[#3d4fe8] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#2232dd]/30 cursor-pointer">
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-5 pt-3 flex flex-col gap-1 border-t border-white/10 mt-1">
            <Link href="/" onClick={() => setMenuOpen(false)}
              className="text-white/60 hover:text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/8 transition-all cursor-pointer">
              Home
            </Link>

            <p className="text-white/30 text-[11px] font-semibold uppercase tracking-widest px-4 pt-3 pb-1">Program</p>
            {PROGRAM_LINKS.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="text-white/60 hover:text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/8 transition-all cursor-pointer">
                {item.label}
              </Link>
            ))}

            <p className="text-white/30 text-[11px] font-semibold uppercase tracking-widest px-4 pt-3 pb-1">Kenapa Kami</p>
            {WHY_LINKS.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="text-white/60 hover:text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/8 transition-all cursor-pointer">
                {item.label}
              </Link>
            ))}

            <Link href="/#faq" onClick={() => setMenuOpen(false)}
              className="text-white/60 hover:text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/8 transition-all cursor-pointer mt-2">
              FAQ
            </Link>
            {loggedIn && (
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                className="text-white/60 hover:text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/8 transition-all cursor-pointer">
                Dashboard
              </Link>
            )}

            <div className="flex gap-3 px-4 mt-2">
              {loggedIn ? (
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold cursor-pointer">
                  Ke Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center border border-white/20 text-white/80 py-2.5 rounded-xl text-sm font-semibold cursor-pointer hover:bg-white/5 transition-colors">
                    Masuk
                  </Link>
                  <Link href="/#produk" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold cursor-pointer">
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
