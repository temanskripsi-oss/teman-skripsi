'use client'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useHideOnScroll } from '@/hooks/useHideOnScroll'

interface Tab { id: string; label: string }

export default function StickyNavTabs({ tabs, accentColor = '#2232dd' }: { tabs: Tab[]; accentColor?: string }) {
  const active = useActiveSection(tabs.map(t => t.id))
  const navHidden = useHideOnScroll()

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 88
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <nav className="sticky z-40 bg-white border-b border-gray-100 shadow-sm transition-[top] duration-300"
      style={{ top: navHidden ? 0 : 64 }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-7 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={`flex-shrink-0 py-4 text-[15px] font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
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
