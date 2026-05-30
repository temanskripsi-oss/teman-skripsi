'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, GraduationCap } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed z-50 left-0 right-0 transition-all duration-500 ${
      scrolled
        ? 'top-3 mx-4 sm:mx-8 rounded-2xl bg-[#1E1B4B]/95 backdrop-blur-xl shadow-2xl shadow-black/30 border border-white/10'
        : 'top-0 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] flex items-center justify-center flex-shrink-0">
              <GraduationCap size={15} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Teman<span className="text-[#9eff63]">Skripsi</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[['/#produk','Produk'],['/#testimoni','Alumni'],['/dashboard','Dashboard']].map(([href, label]) => (
              <Link key={href} href={href}
                className="text-white/60 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/8 cursor-pointer">
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-white/60 hover:text-white text-sm font-medium transition-colors cursor-pointer">
              Masuk
            </Link>
            <Link href="/#produk"
              className="bg-[#2232dd] hover:bg-[#3d4fe8] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#2232dd]/30 cursor-pointer">
              Daftar Sekarang
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-5 pt-3 flex flex-col gap-1 border-t border-white/10 mt-1">
            {[['/#produk','Produk'],['/#testimoni','Alumni'],['/dashboard','Dashboard']].map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                className="text-white/60 hover:text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/8 transition-all cursor-pointer">
                {label}
              </Link>
            ))}
            <div className="flex gap-3 px-4 mt-2">
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center border border-white/20 text-white/80 py-2.5 rounded-xl text-sm font-semibold cursor-pointer hover:bg-white/5 transition-colors">
                Masuk
              </Link>
              <Link href="/#produk" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold cursor-pointer">
                Daftar
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
