import Link from 'next/link'
import { ChevronRight, ArrowRight } from 'lucide-react'

interface Props {
  badge: string; breadcrumb: string; headline: string; sub: string
  price: string; paymentLink: string; trusts: string[]
  accentColor?: string; lightBg?: string
}

export default function ProductHero({ badge, breadcrumb, headline, sub, price, paymentLink, trusts, accentColor = '#2232dd', lightBg = '#eff6ff' }: Props) {
  const isLight = accentColor === '#9eff63' || accentColor === '#4DD9C0'
  return (
    <section className="relative pt-28 pb-16 px-4 overflow-hidden" style={{ background: lightBg }}>
      <div className="absolute inset-0 grid-bg-light pointer-events-none opacity-60" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] opacity-20 pointer-events-none" style={{ background: accentColor }} />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex items-center justify-center gap-1 text-[#9CA3AF] text-xs mb-5">
          <Link href="/" className="hover:text-[#2232dd] transition-colors cursor-pointer">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#6B6B8A]">{breadcrumb}</span>
        </div>

        <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest border"
          style={{ background: `${accentColor}15`, color: accentColor, borderColor: `${accentColor}30` }}>
          {badge}
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E1B4B] mb-5 leading-tight">{headline}</h1>
        <p className="text-[#6B6B8A] text-lg mb-10 max-w-2xl mx-auto leading-relaxed">{sub}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <p className="text-4xl font-bold text-[#1E1B4B] tracking-tight">{price}</p>
          <Link href={paymentLink}
            className="group inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-base transition-all duration-250 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            style={{ background: accentColor, color: isLight ? '#1E1B4B' : 'white', boxShadow:`0 8px 30px ${accentColor}25` }}>
            Daftar Sekarang
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {trusts.map((t, i) => (
            <span key={i} className="bg-white border border-gray-200 text-[#6B6B8A] text-xs px-3 py-1.5 rounded-full shadow-sm">✓ {t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
