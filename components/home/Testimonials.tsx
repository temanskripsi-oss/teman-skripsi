import { Star, Quote } from 'lucide-react'

const testimonials = [
  { name:'Reza Pratama', university:'Universitas Lampung', initials:'RP', color:'#2232dd', bg:'#eff6ff',
    quote:'Awalnya udah hampir DO, nunda 2 tahun lebih. Setelah ikut mentoring, 3 bulan skripsi selesai dan langsung sidang. Beneran berasa punya teman yang nemenin perjalanan.' },
  { name:'Sari Dewi', university:'Universitas Bandar Lampung', initials:'SD', color:'#7C6FCD', bg:'#f5f3ff',
    quote:'Fast Track 30 harinya gila efektif. Dari yang bingung mau nulis apa, dalam sebulan proposal udah ACC. Mentor sabar banget njelasinnya step by step.' },
  { name:'Dimas Arya', university:'Institut Teknologi Sumatera', initials:'DA', color:'#0f766e', bg:'#f0fdfa',
    quote:'Yang paling beda mentornya beneran jadi temen, bukan kayak dosen yang bikin takut. Gua jadi lebih percaya diri tiap bimbingan sama dosen kampus.' },
]

export default function Testimonials() {
  return (
    <section id="testimoni" className="py-20 px-4 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block bg-[#7C6FCD]/10 border border-[#7C6FCD]/20 text-[#7C6FCD] text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            Testimoni
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1E1B4B] mb-4 leading-tight">
            Kata mereka yang<br />
            <span className="text-[#2232dd]">sudah wisuda</span>
          </h2>
          <p className="text-[#9CA3AF] max-w-sm mx-auto">Bukan janji. Pengalaman nyata alumni Teman Skripsi.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i}
              className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-5 hover:shadow-lg hover:border-[#2232dd]/15 hover:-translate-y-1 transition-all duration-300 cursor-default shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill="#f59e0b" className="text-[#f59e0b]" />)}
                </div>
                <Quote size={20} className="text-gray-200" />
              </div>
              <p className="text-[#374151] text-sm leading-relaxed flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: t.color }}>{t.initials}</div>
                <div>
                  <p className="text-[#1E1B4B] font-semibold text-sm">{t.name}</p>
                  <p className="text-[#9CA3AF] text-xs">{t.university}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
