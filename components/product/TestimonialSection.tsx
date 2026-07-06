import { Star } from 'lucide-react'

interface Testimonial {
  quote: string
  name: string
  university: string
  initials: string
  accentColor: string
  lightBg: string
}

interface Props {
  testimonials: Testimonial[]
  accentColor?: string
  embedded?: boolean
}

function Content({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B]">Kata mereka yang sudah lulus</h2>
        <p className="text-[#9CA3AF] text-sm mt-2">340+ mahasiswa dari seluruh Indonesia berhasil bersama TemanSkripsi</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-all">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, si) => (
                <Star key={si} size={13} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-[#374151] text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: t.accentColor }}>
                {t.initials}
              </div>
              <div>
                <p className="font-semibold text-[#1E1B4B] text-sm">{t.name}</p>
                <p className="text-[#9CA3AF] text-xs">{t.university}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default function TestimonialSection({ testimonials, embedded = false }: Props) {
  if (embedded) return <Content testimonials={testimonials} />
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <Content testimonials={testimonials} />
      </div>
    </section>
  )
}
