'use client'
import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: '1.200+',         label: 'Mahasiswa Dibantu',        color: '#2232dd' },
  { value: '< 1 Bulan',   label: 'Rekor Tercepat Lulus',     color: '#16a34a' },
  { value: '3 Bulan',     label: 'Dari Nunda → Lulus',     color: '#7C6FCD' },
  { value: 'Se-Indonesia', label: 'Jangkauan',                color: '#0f766e' },
]

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-white border-b border-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i}
            className={`text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${i * 80}ms` }}>
            <p className="text-3xl sm:text-4xl font-bold mb-1 tracking-tight" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[#9CA3AF] text-xs sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
