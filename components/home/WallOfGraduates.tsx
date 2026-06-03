import { GraduationCap, Award } from 'lucide-react'

const graduates = [
  { name: 'Aulia R.',     university: 'Universitas Indonesia',      milestone: 'Wisuda',  quote: 'Dari bingung judul sampai wisuda dalam 4 bulan!',              color: 'from-[#2232dd] to-[#7C6FCD]' },
  { name: 'Rizky F.',     university: 'Universitas Brawijaya',      milestone: 'Sempro',  quote: 'Proposal ACC pertama kali tanpa revisi besar.',                color: 'from-[#7C6FCD] to-[#4DD9C0]' },
  { name: 'Sinta D.',     university: 'Universitas Diponegoro',     milestone: 'Wisuda',  quote: 'Mentor bantu saya temukan research gap yang kuat.',            color: 'from-[#0f766e] to-[#4DD9C0]' },
  { name: 'Farhan A.',    university: 'UPN Veteran Jakarta',        milestone: 'Sempro',  quote: '30 hari cukup buat saya selesaikan Bab 1-3.',                  color: 'from-[#2232dd] to-[#0f766e]' },
  { name: 'Nadia K.',     university: 'Universitas Airlangga',      milestone: 'Wisuda',  quote: 'Metode penelitian yang tadinya paling bikin pusing, selesai.', color: 'from-[#ea580c] to-[#f59e0b]' },
  { name: 'Dimas P.',     university: 'Universitas Padjadjaran',    milestone: 'Sempro',  quote: 'Bimbingan fleksibel, cocok buat yang kerja sambil skripsi.',   color: 'from-[#7C6FCD] to-[#2232dd]' },
  { name: 'Tasha M.',     university: 'Universitas Hasanuddin',     milestone: 'Wisuda',  quote: 'Alhamdulillah, wisuda sesuai target!',                         color: 'from-[#16a34a] to-[#4DD9C0]' },
  { name: 'Bagas W.',     university: 'Universitas Gadjah Mada',    milestone: 'Sempro',  quote: 'Proposal saya langsung diterima sempro tanpa revisi.',         color: 'from-[#2232dd] to-[#4DD9C0]' },
]

export default function WallOfGraduates() {
  return (
    <section className="py-20 px-4 bg-[#1E1B4B] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg-dark pointer-events-none opacity-40" />
      <div className="absolute left-1/4 top-0 w-96 h-96 bg-[#2232dd] rounded-full blur-[160px] opacity-10 pointer-events-none" />
      <div className="absolute right-1/4 bottom-0 w-96 h-96 bg-[#4DD9C0] rounded-full blur-[160px] opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/70 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <GraduationCap size={13} /> 340+ Mahasiswa Berhasil
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            The Wall of <span className="text-[#4DD9C0]">Graduates</span>
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto leading-relaxed">
            Mereka pernah di posisi yang sama seperti kamu. Bingung, stuck, dan hampir nyerah. Sekarang sudah di sisi lain.
          </p>
        </div>

        {/* Grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {graduates.map((g, i) => (
            <div key={i} className="break-inside-avoid">
              <div className={`bg-gradient-to-br ${g.color} rounded-2xl overflow-hidden`}>
                {/* Photo placeholder */}
                <div className="aspect-[3/4] flex items-center justify-center relative">
                  <span className="text-white/30 text-5xl font-bold select-none">
                    {g.name.split(' ').map(n => n[0]).join('')}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        g.milestone === 'Wisuda'
                          ? 'bg-[#4DD9C0] text-[#1E1B4B]'
                          : 'bg-white/20 text-white'
                      }`}>
                        {g.milestone === 'Wisuda' ? '🎓 Wisuda' : '✅ Sempro ACC'}
                      </span>
                    </div>
                    <p className="text-white font-semibold text-sm leading-tight">{g.name}</p>
                    <p className="text-white/60 text-[10px]">{g.university}</p>
                  </div>
                </div>
                {/* Quote */}
                <div className="px-3 py-2.5 bg-black/20">
                  <p className="text-white/80 text-xs leading-relaxed italic">"{g.quote}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-2xl px-6 py-3">
            <Award size={16} className="text-[#4DD9C0]" />
            <p className="text-white/60 text-sm">
              Kamu bisa jadi bagian dari wall ini. <span className="text-[#4DD9C0] font-semibold">Mulai sekarang →</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
