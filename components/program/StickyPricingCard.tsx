import Link from 'next/link'
import { ArrowRight, type LucideIcon } from 'lucide-react'

export interface PricingFact {
  icon: LucideIcon
  label: string
  value: string
}

interface Props {
  name: string
  price: string
  originalPrice?: string
  paymentLink: string
  facts: PricingFact[]
  trustText: string
  accentColor?: string
}

export default function StickyPricingCard({ name, price, originalPrice, paymentLink, facts, trustText, accentColor = '#2232dd' }: Props) {
  return (
    <div className="sticky top-32 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100" style={{ background: `${accentColor}0d` }}>
        <p className="font-bold text-[#1E1B4B] text-base">{name}</p>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-baseline gap-2 mb-1">
          <p className="text-2xl font-extrabold tracking-tight" style={{ color: accentColor }}>{price}</p>
          {originalPrice && <p className="text-sm text-[#9CA3AF] line-through">{originalPrice}</p>}
        </div>
        <p className="text-[#9CA3AF] text-xs mb-5">Pembayaran via QRIS · akses langsung ke dashboard</p>

        <div className="flex flex-col gap-2.5 mb-5">
          {facts.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="flex items-center gap-2.5 text-sm">
                <Icon size={15} style={{ color: accentColor }} className="flex-shrink-0" />
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
        <p className="text-center text-[#9CA3AF] text-[11px] mt-3">{trustText}</p>
      </div>
    </div>
  )
}
