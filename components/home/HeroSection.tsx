'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight, Star, TrendingUp, Zap } from 'lucide-react'

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>('[data-delay]').forEach(el => {
      el.style.animationDelay = `${el.dataset.delay}s`
    })
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen bg-[#1E1B4B] overflow-hidden flex items-center">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none grid-bg" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#2232dd] rounded-full blur-[160px] opacity-20" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-[#7C6FCD] rounded-full blur-[130px] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#9eff63] rounded-full blur-[120px] opacity-[0.06]" />
        <div className="absolute right-[8%] top-[12%] w-[420px] h-[420px] rounded-full border border-white/5 animate-spin-slow" />
        <div className="absolute right-[11%] top-[15%] w-[320px] h-[320px] rounded-full border border-[#2232dd]/15 animate-spin-slow" style={{ animationDirection:'reverse', animationDuration:'20s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div className="order-2 lg:order-1">
            <div className="animate-fade-in-left" data-delay="0">
              <span className="inline-flex items-center gap-2 bg-[#9eff63]/10 border border-[#9eff63]/25 text-[#9eff63] px-4 py-1.5 rounded-full text-xs font-semibold mb-7 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-[#9eff63] rounded-full animate-pulse" />
                340+ Alumni Wisuda Se-Indonesia
              </span>
            </div>

            <h1 className="animate-fade-in-left text-[52px] sm:text-[64px] lg:text-[72px] xl:text-[84px] font-bold text-white leading-[1.0] tracking-tight mb-6" data-delay="0.1">
              Skripsi itu<br />
              <span className="gradient-text-electric font-extrabold">gampang.</span><br />
              Asal sama<br />
              <span className="text-[#4DD9C0]">orang tepat.</span>
            </h1>

            <p className="animate-fade-in-left text-white/55 text-base sm:text-lg leading-relaxed mb-10 max-w-md" data-delay="0.2">
              Dari yang baru mulai sampai yang hampir DO — kami sudah bantu{' '}
              <strong className="text-white/90 font-semibold">340+ mahasiswa</strong>{' '}
              dari Sabang sampai Merauke lulus tepat waktu.
            </p>

            <div className="animate-fade-in-left flex flex-col sm:flex-row gap-3 mb-10" data-delay="0.3">
              <a href="#produk"
                className="group inline-flex items-center justify-center gap-2.5 bg-[#2232dd] hover:bg-[#3d4fe8] text-white px-7 py-4 rounded-2xl font-semibold text-base transition-all duration-250 hover:shadow-2xl hover:shadow-[#2232dd]/35 hover:-translate-y-0.5 cursor-pointer">
                Lihat Program Kami
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              <a href="#testimoni"
                className="inline-flex items-center justify-center gap-2 glass-card text-white/80 hover:text-white px-7 py-4 rounded-2xl font-medium text-base transition-all duration-250 hover:bg-white/10 cursor-pointer">
                Cerita Alumni
              </a>
            </div>

            {/* Trust row */}
            <div className="animate-fade-in-left flex items-center gap-4" data-delay="0.4">
              <div className="flex -space-x-2.5">
                {[['RP','#2232dd'],['SD','#7C6FCD'],['DA','#4DD9C0'],['MR','#9eff63'],['LK','#2232dd']].map(([init, bg], i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1E1B4B] flex items-center justify-center text-[9px] font-bold"
                    style={{ background: bg, color: bg === '#9eff63' ? '#1E1B4B' : 'white' }}>
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={11} fill="#9eff63" className="text-[#9eff63]" />)}
                  <span className="text-white font-bold text-sm ml-1">5.0</span>
                </div>
                <p className="text-white/40 text-xs">dari 340+ alumni terpercaya</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px]">
              {/* Main visual */}
              <div className="animate-fade-in-right relative h-[460px] sm:h-[520px]" data-delay="0.15">
                {/* Background circle decoration */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[360px] h-[360px] rounded-full bg-gradient-to-b from-[#2232dd]/30 to-[#7C6FCD]/10 blur-2xl" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full border border-[#2232dd]/20 animate-spin-slow" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[240px] h-[240px] rounded-full border border-[#9eff63]/15 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '20s' }} />
                {/* Decorative dots */}
                <div className="absolute top-10 right-6 w-3 h-3 rounded-full bg-[#9eff63] opacity-60" />
                <div className="absolute top-20 right-16 w-2 h-2 rounded-full bg-[#4DD9C0] opacity-40" />
                <div className="absolute top-6 left-10 w-2 h-2 rounded-full bg-[#2232dd] opacity-50" />
                {/* Graduate photo */}
                <div className="relative h-full flex items-end justify-center">
                  <Image
                    src="/images/hero-graduate.png"
                    alt="Alumni Teman Skripsi wisuda"
                    width={380}
                    height={520}
                    className="object-contain object-bottom h-full w-auto drop-shadow-2xl"
                    priority
                  />
                </div>
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1E1B4B] to-transparent" />
              </div>

              {/* Floating cards */}
              <div className="absolute -left-6 top-8 glass-card rounded-2xl px-4 py-3 animate-float shadow-xl shadow-black/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#9eff63]/15 flex items-center justify-center">
                    <Star size={16} fill="#9eff63" className="text-[#9eff63]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-none">5.0</p>
                    <p className="text-white/40 text-[11px] mt-0.5">Rating Alumni</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-5 top-1/3 glass-card rounded-2xl px-4 py-3 animate-float-slow shadow-xl shadow-black/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2232dd]/25 flex items-center justify-center">
                    <TrendingUp size={16} className="text-[#4DD9C0]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-none">340+</p>
                    <p className="text-white/40 text-[11px] mt-0.5">Alumni Wisuda</p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-4 bottom-20 glass-card rounded-2xl px-4 py-3 shadow-xl shadow-black/30" style={{ animation:'float 5s ease-in-out infinite 2s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#9eff63]/15 flex items-center justify-center">
                    <Zap size={16} className="text-[#9eff63]" />
                  </div>
                  <div>
                    <p className="text-[#9eff63] font-bold text-xs leading-none">Bimbingan</p>
                    <p className="text-white font-semibold text-xs mt-0.5">Personal 1-on-1</p>
                  </div>
                </div>
              </div>

              <div className="absolute right-2 bottom-8 glass-card rounded-2xl px-3.5 py-2.5 animate-float shadow-xl shadow-black/30">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {[['RP','#2232dd'],['SD','#7C6FCD'],['DA','#4DD9C0']].map(([init,bg],i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center text-[7px] font-bold"
                        style={{ background: bg, color: bg === '#4DD9C0' ? '#1E1B4B' : 'white' }}>
                        {init}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-white text-[11px] font-bold">Se-Indonesia</p>
                    <p className="text-white/35 text-[9px]">Online & Offline</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#1E1B4B] to-transparent pointer-events-none" />
    </section>
  )
}

function GraduationCapIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  )
}
