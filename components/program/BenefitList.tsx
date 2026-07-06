'use client'
import { Check } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface BenefitItem {
  text: string
  exclusive?: boolean
}

function BenefitCard({ item, index, accentColor }: { item: BenefitItem; index: number; accentColor: string }) {
  const { ref, visible } = useScrollReveal()
  const delay = `reveal-delay-${Math.min(index + 1, 5)}`

  if (item.exclusive) {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${delay} ${visible ? 'visible' : ''} sm:col-span-2 rounded-xl px-4 py-3.5 flex items-center gap-3 text-white`}
        style={{ background: '#3D3DB4' }}>
        <Check size={16} className="flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{item.text}</p>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 uppercase tracking-widest whitespace-nowrap">Eksklusif</span>
      </div>
    )
  }

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${delay} ${visible ? 'visible' : ''} bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm`}>
      <Check size={16} style={{ color: accentColor }} className="flex-shrink-0" />
      <p className="text-[#374151] text-sm">{item.text}</p>
    </div>
  )
}

export default function BenefitList({ items, accentColor = '#2232dd' }: { items: BenefitItem[]; accentColor?: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item, i) => (
        <BenefitCard key={i} item={item} index={i} accentColor={accentColor} />
      ))}
    </div>
  )
}
