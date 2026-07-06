'use client'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface FAQItem { q: string; a: string }

function Content({ items, open, setOpen }: { items: FAQItem[]; open: number | null; setOpen: (i: number | null) => void }) {
  return (
    <>
      <div className="text-center mb-10">
        <span className="inline-block bg-[#7C6FCD]/10 border border-[#7C6FCD]/20 text-[#7C6FCD] text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">FAQ</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B]">Pertanyaan yang sering ditanya</h2>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm ${open === i ? 'border-[#2232dd]/25 shadow-md' : 'border-gray-100 hover:border-[#2232dd]/15'}`}>
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-[#1E1B4B] hover:bg-gray-50/50 transition-colors cursor-pointer gap-4 rounded-2xl">
              <span className="text-sm leading-snug">{item.q}</span>
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#2232dd]/8 flex items-center justify-center text-[#2232dd]">
                {open === i ? <Minus size={14} /> : <Plus size={14} />}
              </div>
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-[#6B6B8A] text-sm leading-relaxed border-t border-gray-50 pt-4">{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default function FAQ({ items, embedded = false }: { items: FAQItem[]; embedded?: boolean }) {
  const [open, setOpen] = useState<number | null>(null)
  if (embedded) return <Content items={items} open={open} setOpen={setOpen} />
  return (
    <section className="py-16 px-4 bg-[#f4f8ff] relative">
      <div className="max-w-3xl mx-auto">
        <Content items={items} open={open} setOpen={setOpen} />
      </div>
    </section>
  )
}
