'use client'
import { useEffect, useRef, useState } from 'react'
import { HelpCircle, AlertTriangle, Clock, BookOpen, Briefcase, XCircle } from 'lucide-react'

const problems = [
  { icon: HelpCircle,    text: 'Bingung mulai dari mana',              sub: 'Nggak ada arah yang jelas' },
  { icon: AlertTriangle, text: 'Takut salah, takut ditolak dosen',     sub: 'Rasa takut yang menghambat' },
  { icon: Clock,         text: 'Nunda terus sampai hampir DO',         sub: 'Waktu terus habis' },
  { icon: BookOpen,      text: 'Nggak ada yang ngajarin step by step', sub: 'Belajar sendiri tanpa arah' },
  { icon: Briefcase,     text: 'Sibuk kerja, susah atur waktu',        sub: 'Kehidupan yang menghambat' },
  { icon: XCircle,       text: 'Udah coba sendiri tapi mentok',        sub: 'Effort tanpa hasil nyata' },
]

export default function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-20 px-4 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-block bg-red-50 border border-red-100 text-red-500 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            Kita Ngerti
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E1B4B] mb-4 leading-tight">
            Pernah ngerasa<br />
            <span className="text-[#2232dd]">kayak gini?</span>
          </h2>
          <p className="text-[#9CA3AF] max-w-md mx-auto">Kalau iya, kamu nggak sendirian. Dan ini bukan salahmu.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((p, i) => {
            const Icon = p.icon
            return (
              <div key={i}
                className={`bg-white border border-gray-100 hover:border-[#2232dd]/25 rounded-2xl p-5 flex items-start gap-4 transition-all duration-300 hover:shadow-md cursor-default ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="p-2.5 rounded-xl bg-red-50 text-red-400 flex-shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-[#1E1B4B] font-semibold text-sm leading-snug mb-0.5">{p.text}</p>
                  <p className="text-[#9CA3AF] text-xs">{p.sub}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className={`mt-10 text-center transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-[#6B6B8A] text-base">
            Kamu nggak sendirian. Dan ini{' '}
            <span className="text-[#2232dd] font-semibold">bukan salahmu.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
