import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ArrowRight, Star } from 'lucide-react'

interface HeroTestimonial {
  quote: string
  name: string
  university: string
}

interface Props {
  badge: string
  breadcrumb: string
  headline: string
  sub: string
  price: string
  paymentLink: string
  trusts: string[]
  accentColor?: string
  lightBg?: string
  testimonial: HeroTestimonial
  photo?: string
}

export default function HeroProgram({ badge, breadcrumb, headline, sub, price, paymentLink, trusts, accentColor = '#2232dd', lightBg = '#eff6ff', testimonial, photo }: Props) {
  const isLight = accentColor === '#9eff63' || accentColor === '#4DD9C0'

  return (
    <section className="relative pt-28 pb-20 px-4 overflow-hidden" style={{ background: lightBg }}>
      <div className="absolute inset-0 grid-bg-light pointer-events-none opacity-60" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] opacity-20 pointer-events-none" style={{ background: accentColor }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-1 text-[#9CA3AF] text-xs mb-8">
          <Link href="/" className="hover:text-[#2232dd] transition-colors cursor-pointer">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#6B6B8A]">{breadcrumb}</span>
        </div>

        <div className="grid lg:grid-cols-[55%_45%] gap-10 lg:gap-8 items-center">
          {/* Kolom kiri — konten */}
          <div>
            <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest border"
              style={{ background: `${accentColor}15`, color: accentColor, borderColor: `${accentColor}30` }}>
              {badge}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-bold text-[#1E1B4B] mb-5 leading-[1.1] tracking-[-0.02em]">
              {headline}
            </h1>
            <p className="text-[#636687] text-lg mb-8 max-w-[520px] leading-relaxed">{sub}</p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <p className="text-3xl sm:text-4xl font-bold text-[#1E1B4B] tracking-tight">{price}</p>
              <Link href={paymentLink}
                className="group inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-2xl text-base transition-all duration-250 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                style={{ background: accentColor, color: isLight ? '#1E1B4B' : 'white', boxShadow: `0 8px 30px ${accentColor}25` }}>
                Daftar Sekarang
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="text-[#6B6B8A] text-xs mb-8">Pembayaran via QRIS · Akses langsung ke dashboard</p>

            <div className="flex flex-wrap gap-2.5">
              {trusts.map((t, i) => (
                <span key={i} className="bg-white border border-gray-200 text-[#6B6B8A] text-xs px-3 py-1.5 rounded-full shadow-sm">✓ {t}</span>
              ))}
            </div>
          </div>

          {/* Kolom kanan — visual */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl"
              style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #1E1B4B 100%)` }}>
              {photo ? (
                <Image src={photo} alt={testimonial.name} fill className="object-cover object-top" sizes="(min-width: 1024px) 45vw, 100vw" priority />
              ) : (
                <>
                  <div className="absolute inset-0 grid-bg-dark opacity-30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Star size={64} className="text-white/15" fill="currentColor" />
                  </div>
                </>
              )}
            </div>

            <div className="absolute -bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-4">
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-[#374151] text-xs leading-relaxed mb-3">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                  style={{ background: accentColor }}>
                  {testimonial.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="font-semibold text-[#1E1B4B] text-xs">{testimonial.name}</p>
                  <p className="text-[#9CA3AF] text-[11px]">{testimonial.university}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
