'use client'
import { useActiveSection } from '@/hooks/useActiveSection'

interface Tab { id: string; label: string }

export default function StickyNavTabs({ tabs, accentColor = '#2232dd' }: { tabs: Tab[]; accentColor?: string }) {
  const active = useActiveSection(tabs.map(t => t.id))

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 88
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <nav className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={`flex-shrink-0 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                active === tab.id
                  ? 'font-semibold'
                  : 'border-transparent text-[#636687] hover:text-[#1E1B4B]'
              }`}
              style={active === tab.id ? { color: accentColor, borderBottomColor: accentColor } : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
