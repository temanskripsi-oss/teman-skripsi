import Link from 'next/link'
import { ArrowRight, type LucideIcon } from 'lucide-react'

export interface PricingFact {
  icon: LucideIcon
  label: string
  value: string
}

interface Props {
  icon: LucideIcon
  name: string
  price: string
  paymentLink: string
  facts: PricingFact[]
  trustCount: string
  trustNames: string[]
  accentColor?: string
}

function initialsOf(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

export default function StickyPricingCard({ icon: Icon, name, price, paymentLink, facts, trustCount, trustNames, accentColor = '#2232dd' }: Props) {
  return (
    <div className="sticky top-32 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
      <div className="px-6 py-5 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${accentColor}14 0%, ${accentColor}05 100%)` }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accentColor}1a`, color: accentColor }}>
          <Icon size={20} />
        </div>
        <p className="font-bold text-[#1E1B4B] text-base leading-snug">{name}</p>
      </div>

      <div className="px-6 py-5">
        <p className="text-[28px] font-extrabold tracking-tight leading-none mb-1.5" style={{ color: accentColor }}>{price}</p>
        <p className="text-[#9CA3AF] text-xs mb-5">Pembayaran via QRIS · akses langsung ke dashboard</p>

        <div className="flex flex-col gap-3 mb-5 pb-5 border-b border-gray-100">
          {facts.map((f, i) => {
            const FactIcon = f.icon
            return (
              <div key={i} className="flex items-center gap-2.5 text-sm">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${accentColor}12`, color: accentColor }}>
                  <FactIcon size={13} />
                </span>
                <span className="text-[#6B6B8A]">{f.label}:</span>
                <span className="font-semibold text-[#1E1B4B]">{f.value}</span>
              </div>
            )
          })}
        </div>

        <Link href={paymentLink}
          className="group flex items-center justify-center gap-2 w-full font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-250 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
          style={{ background: accentColor, color: 'white', boxShadow: `0 8px 24px ${accentColor}25` }}>
          Daftar Sekarang
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="flex items-center justify-center gap-2.5 mt-4">
          <div className="flex -space-x-2.5">
            {trustNames.slice(0, 3).map((n, i) => (
              <div key={i} className="w-7 h-7 rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px] font-bold"
                style={{ background: `${accentColor}${['e6', 'b3', '80'][i] ?? 'e6'}` }}>
                {initialsOf(n)}
              </div>
            ))}
          </div>
          <p className="text-[#6B6B8A] text-xs">
            <span className="font-bold text-[#1E1B4B]">{trustCount}</span> alumni bergabung
          </p>
        </div>
      </div>
    </div>
  )
}
