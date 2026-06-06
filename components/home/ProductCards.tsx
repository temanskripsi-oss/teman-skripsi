'use client'
import Link from 'next/link'
import { ArrowRight, Zap, Users, FlaskConical, Check, Gift } from 'lucide-react'

const products = [
  {
    icon: Zap,
    tag: 'Untuk Pemula',
    tagBg: 'bg-[#1E1B4B] text-white',
    name: 'Fast Track Sempro',
    sub: '30 Hari',
    desc: 'Sistem terstruktur 30 hari yang sudah terbukti bantu ratusan mahasiswa dari bingung jadi proposal ACC.',
    price: 'Rp 500.000',
    href: '/fastrack',
    accentBg: '#f0fdf4',
    accentBtn: '#1E1B4B',
    accentBtnText: 'white',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    checkColor: '#16a34a',
    features: [
      'Video learning lengkap',
      '4x Zoom coaching online',
      '4x written feedback mentor',
      'Template proposal Bab 1–3 & PPT Sempro',
      'Bonus eksklusif: framework, prompt AI & script',
      'Akses grup komunitas alumni',
    ],
  },
  {
    icon: Users,
    tag: 'Paling Populer',
    tagBg: 'bg-[#2232dd] text-white',
    name: 'Mentoring Privat',
    sub: 'Paket Sempro',
    desc: 'Bimbingan personal 1-on-1 dengan mentor berpengalaman dari judul sampai proposal ACC.',
    price: 'Rp 2.000.000',
    href: '/mentoring-sempro',
    accentBg: '#eff6ff',
    accentBtn: '#2232dd',
    accentBtnText: 'white',
    iconBg: '#dbeafe',
    iconColor: '#2232dd',
    checkColor: '#2232dd',
    featured: true,
    features: [
      '9 pertemuan privat (6x online + 3x offline)',
      '9x written feedback dari mentor',
      '3 bulan masa aktif program',
      'Persiapan & simulasi seminar proposal',
      'Akses dashboard + video learning',
      'Template & freebies lengkap',
      { text: 'FREE akses penuh Fast Track Sempro', highlight: true },
    ],
    freeTag: 'Termasuk Fast Track',
  },
  {
    icon: FlaskConical,
    tag: 'Siap Sidang',
    tagBg: 'bg-[#0f766e] text-white',
    name: 'Mentoring Privat',
    sub: 'Paket Bab 4–5',
    desc: 'Dari analisis data sampai kamu berdiri percaya diri di depan dosen penguji dan lulus.',
    price: 'Rp 2.250.000',
    href: '/mentoring-penelitian',
    accentBg: '#f0fdfa',
    accentBtn: '#0f766e',
    accentBtnText: 'white',
    iconBg: '#ccfbf1',
    iconColor: '#0f766e',
    checkColor: '#0f766e',
    features: [
      '9 pertemuan privat (6x online + 3x offline)',
      '9x written feedback dari mentor',
      '3 bulan masa aktif program',
      'Bimbingan analisis data SPSS / SmartPLS',
      'Penulisan Bab 4 & 5 step by step',
      'Simulasi sidang di pertemuan terakhir',
      'Akses dashboard + video learning',
      { text: 'FREE akses penuh Fast Track Sempro', highlight: true },
    ],
    freeTag: 'Termasuk Fast Track',
  },
]

export default function ProductCards() {
  return (
    <section id="produk" className="py-24 px-4 bg-white relative">

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="inline-block bg-[#2232dd]/10 border border-[#2232dd]/20 text-[#2232dd] text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            Program Kami
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E1B4B] mb-4 leading-tight">
            Pilih program yang<br />
            <span className="text-[#2232dd]">sesuai perjalananmu</span>
          </h2>
          <p className="text-[#6B6B8A] max-w-lg mx-auto text-base">
            Dari yang baru mulai sampai yang siap sidang. Semua program sudah terbukti bantu 340+ mahasiswa wisuda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {products.map((p, i) => {
            const Icon = p.icon
            return (
              <div key={i}
                className={`relative rounded-3xl flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  p.featured
                    ? 'bg-white shadow-2xl shadow-[#2232dd]/15 ring-2 ring-[#2232dd]'
                    : 'bg-white shadow-lg shadow-black/8 hover:shadow-black/12'
                }`}>

                {p.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2232dd] text-white text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-lg shadow-[#2232dd]/30">
                    Paling Populer
                  </div>
                )}

                {/* Card header */}
                <div className="rounded-t-3xl px-7 pt-8 pb-6" style={{ background: p.accentBg }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: p.iconBg }}>
                      <Icon size={22} style={{ color: p.iconColor }} />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${p.tagBg}`}>{p.tag}</span>
                  </div>

                  <div className="mb-1">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: p.iconColor }}>{p.sub}</p>
                    <h3 className="text-2xl font-bold text-[#1E1B4B] leading-tight">{p.name}</h3>
                  </div>
                  <p className="text-[#6B6B8A] text-sm leading-relaxed mt-2">{p.desc}</p>

                  {p.freeTag && (
                    <div className="mt-4 inline-flex items-center gap-1.5 bg-[#9eff63]/20 border border-[#9eff63]/40 text-[#1E1B4B] text-xs font-bold px-3 py-1.5 rounded-full">
                      <Gift size={12} className="text-[#16a34a]" />
                      {p.freeTag}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="px-7 py-6 flex-1">
                  <p className="text-[#1E1B4B] text-xs font-semibold uppercase tracking-wider mb-4">Yang kamu dapat:</p>
                  <ul className="flex flex-col gap-3">
                    {p.features.map((f, fi) => {
                      const isObj = typeof f === 'object'
                      const text = isObj ? f.text : f
                      const highlight = isObj && f.highlight
                      return (
                        <li key={fi} className={`flex items-center gap-3 text-sm leading-snug ${highlight ? 'font-semibold' : ''}`}>
                          <Check size={15} className="flex-shrink-0" style={{ color: p.checkColor }} />
                          <span className="flex items-center gap-1.5 flex-wrap"
                            style={highlight ? { color: p.iconColor } : undefined}>
                            <span className={highlight ? '' : 'text-[#374151]'}>{text}</span>
                            {highlight && (
                              <span className="inline-flex items-center bg-[#9eff63]/20 text-[#16a34a] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#9eff63]/40 whitespace-nowrap">
                                GRATIS
                              </span>
                            )}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* Price + CTA */}
                <div className="px-7 pb-7 pt-4 border-t border-gray-100">
                  <div className="flex items-baseline gap-1 mb-4">
                    <p className="text-3xl font-bold text-[#1E1B4B] tracking-tight">{p.price}</p>
                    <p className="text-[#9CA3AF] text-sm">/program</p>
                  </div>
                  <Link href={p.href}
                    className="group flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 hover:gap-3 cursor-pointer hover:opacity-90 hover:shadow-lg"
                    style={{ background: p.accentBtn, color: p.accentBtnText, boxShadow: `0 4px 14px ${p.accentBtn}30` }}>
                    Pelajari Lebih Lanjut
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust note */}
        <p className="text-center text-[#9CA3AF] text-sm mt-10">
          Semua program termasuk akses dashboard, materi video, template, dan support mentor.{' '}
          <a href="https://wa.me/6289524785477" target="_blank" rel="noopener noreferrer" className="text-[#2232dd] font-semibold hover:underline cursor-pointer">
            Tanya dulu via WhatsApp
          </a>
        </p>
      </div>
    </section>
  )
}
