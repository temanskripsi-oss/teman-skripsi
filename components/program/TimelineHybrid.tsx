'use client'
import { MapPin, Users, Presentation } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export interface TimelinePhase {
  days: string
  title: string
  desc: string
  tags: string[]
  color: string
  bg: string
  offline?: boolean
  dividerLabel?: string
}

function PhaseCard({ phase, index }: { phase: TimelinePhase; index: number }) {
  const { ref, visible } = useScrollReveal(0.15)
  const delay = `reveal-delay-${Math.min(index % 5 + 1, 5)}`

  return (
    <div>
      {phase.dividerLabel && (
        <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3 mt-2 first:mt-0">{phase.dividerLabel}</p>
      )}
      <div ref={ref as React.RefObject<HTMLDivElement>} className={`tl-card reveal ${delay} ${visible ? 'visible' : ''} flex gap-4 mb-4`}>
        {/* Connector */}
        <div className="flex flex-col items-center flex-shrink-0 pt-1">
          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: phase.color }} />
          <span className={`tl-connector w-px flex-1 mt-1 ${visible ? 'visible' : ''}`} style={{ background: `${phase.color}30`, minHeight: '24px' }} />
        </div>

        {/* Card */}
        <div
          className={`flex-1 rounded-2xl px-5 py-4 shadow-sm mb-2 ${phase.offline ? 'bg-[#F0EEFF]' : 'bg-white border border-gray-100'}`}
          style={phase.offline ? { border: '1.5px solid #3D3DB4' } : undefined}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap mb-1.5">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap uppercase tracking-widest"
              style={{ background: `${phase.color}15`, color: phase.color }}>
              Hari {phase.days}
            </span>
            {phase.offline && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#3D3DB4] text-white uppercase tracking-widest">Pertemuan Offline</span>
            )}
          </div>
          <p className="font-semibold text-[#1E1B4B] text-sm mb-1">{phase.title}</p>
          <p className="text-[#9CA3AF] text-xs leading-relaxed mb-2.5">{phase.desc}</p>
          <div className="flex flex-wrap gap-1.5">
            {phase.tags.map((tag, i) => (
              <span key={i} className="text-[11px] text-[#6B6B8A] bg-gray-50 px-2.5 py-1 rounded-lg">{tag}</span>
            ))}
            {phase.offline && (
              <>
                <span className="flex items-center gap-1 text-[11px] text-[#3D3DB4] bg-white px-2.5 py-1 rounded-lg border border-[#3D3DB4]/20">
                  <MapPin size={11} /> Bandar Lampung
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#3D3DB4] bg-white px-2.5 py-1 rounded-lg border border-[#3D3DB4]/20">
                  <Users size={11} /> Tatap muka
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#3D3DB4] bg-white px-2.5 py-1 rounded-lg border border-[#3D3DB4]/20">
                  <Presentation size={11} /> Simulasi presentasi
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TimelineHybrid({ phases }: { phases: TimelinePhase[] }) {
  return (
    <div>
      {phases.map((phase, i) => (
        <PhaseCard key={i} phase={phase} index={i} />
      ))}
    </div>
  )
}
