'use client'
import { useCountUp } from '@/hooks/useCountUp'

export interface Stat {
  /** Angka untuk animasi count-up. Kosongkan untuk stat non-numerik (pakai `display`). */
  value?: number
  suffix?: string
  /** Teks statis pengganti angka, untuk stat non-numerik seperti "1-on-1 Privat". */
  display?: string
  label: string
}

function StatItem({ stat, isLast }: { stat: Stat; isLast: boolean }) {
  const { ref, value } = useCountUp(stat.value ?? 0)
  const display = stat.value !== undefined
    ? `${new Intl.NumberFormat('id-ID').format(value)}${stat.suffix ?? ''}`
    : stat.display

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`text-center py-6 px-3 ${!isLast ? 'sm:border-r sm:border-gray-100' : ''}`}>
      <p className="text-2xl sm:text-[28px] font-extrabold text-[#2232dd] tracking-tight">{display}</p>
      <p className="text-[#636687] text-[13px] mt-1">{stat.label}</p>
    </div>
  )
}

export default function QuickStats({ stats }: { stats: Stat[] }) {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4">
        {stats.map((s, i) => (
          <StatItem key={i} stat={s} isLast={i === stats.length - 1} />
        ))}
      </div>
    </section>
  )
}
