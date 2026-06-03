import { GraduationCap, Award } from 'lucide-react'

interface Graduate {
  name: string
  prodi: string
  university: string
  milestone: 'Wisuda' | 'Sempro'
  color: string
}

const ROW_1: Graduate[] = [
  { name: 'Aulia R.',   prodi: 'Manajemen',          university: 'Universitas Indonesia',   milestone: 'Wisuda', color: 'from-[#2232dd] to-[#7C6FCD]' },
  { name: 'Rizky F.',   prodi: 'Akuntansi',           university: 'Universitas Brawijaya',   milestone: 'Sempro', color: 'from-[#7C6FCD] to-[#4DD9C0]' },
  { name: 'Sinta D.',   prodi: 'Psikologi',           university: 'Universitas Diponegoro',  milestone: 'Wisuda', color: 'from-[#0f766e] to-[#4DD9C0]' },
  { name: 'Farhan A.',  prodi: 'Ilmu Komunikasi',     university: 'UPN Veteran Jakarta',     milestone: 'Sempro', color: 'from-[#2232dd] to-[#0f766e]' },
  { name: 'Nadia K.',   prodi: 'Hukum',               university: 'Universitas Airlangga',   milestone: 'Wisuda', color: 'from-[#ea580c] to-[#f59e0b]' },
  { name: 'Dimas P.',   prodi: 'Administrasi Bisnis', university: 'Universitas Padjadjaran', milestone: 'Sempro', color: 'from-[#7C6FCD] to-[#2232dd]' },
]

const ROW_2: Graduate[] = [
  { name: 'Tasha M.',   prodi: 'Ekonomi Pembangunan', university: 'Universitas Hasanuddin',  milestone: 'Wisuda', color: 'from-[#16a34a] to-[#4DD9C0]' },
  { name: 'Bagas W.',   prodi: 'Manajemen Pemasaran', university: 'Universitas Gadjah Mada', milestone: 'Sempro', color: 'from-[#2232dd] to-[#4DD9C0]' },
  { name: 'Karina S.',  prodi: 'Sosiologi',           university: 'Universitas Sebelas Maret',milestone:'Wisuda', color: 'from-[#7C6FCD] to-[#ea580c]' },
  { name: 'Hendra B.',  prodi: 'Pendidikan Ekonomi',  university: 'Universitas Negeri Jakarta',milestone:'Sempro',color: 'from-[#4DD9C0] to-[#2232dd]' },
  { name: 'Mira L.',    prodi: 'Ilmu Hukum',          university: 'Universitas Sriwijaya',   milestone: 'Wisuda', color: 'from-[#f59e0b] to-[#ea580c]' },
  { name: 'Aldi N.',    prodi: 'Teknik Industri',     university: 'Universitas Trisakti',    milestone: 'Sempro', color: 'from-[#0f766e] to-[#2232dd]' },
]

function GradCard({ g }: { g: Graduate }) {
  const isWisuda = g.milestone === 'Wisuda'
  const initials = g.name.split(' ').map(n => n[0]).join('')

  return (
    <div className="flex-shrink-0 w-44 rounded-2xl overflow-hidden shadow-md border border-gray-100">
      {/* Photo area */}
      <div className={`h-52 bg-gradient-to-br ${g.color} flex items-center justify-center relative`}>
        <span className="text-white/25 text-4xl font-bold select-none tracking-widest">{initials}</span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
            isWisuda
              ? 'bg-[#4DD9C0] text-[#1E1B4B]'
              : 'bg-white/90 text-[#2232dd]'
          }`}>
            {isWisuda ? <GraduationCap size={10} /> : <Award size={10} />}
            {isWisuda ? 'Wisuda' : 'Sempro ACC'}
          </span>
        </div>
      </div>
      {/* Info */}
      <div className="bg-white px-3 py-2.5">
        <p className="font-bold text-[#1E1B4B] text-sm leading-tight">{g.name}</p>
        <p className="text-[#2232dd] text-[11px] font-medium mt-0.5">{g.prodi}</p>
        <p className="text-[#9CA3AF] text-[10px] mt-0.5 leading-tight">{g.university}</p>
      </div>
    </div>
  )
}

export default function WallOfGraduates() {
  return (
    <section className="py-20 bg-[#f4f8ff] overflow-hidden">
      {/* Header */}
      <div className="text-center mb-12 px-4">
        <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#2232dd]/20 text-[#2232dd] text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
          <GraduationCap size={13} /> 340+ Mahasiswa Berhasil
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-[#1E1B4B] mb-4 leading-tight">
          The Wall of <span className="gradient-text-navy">Graduates</span>
        </h2>
        <p className="text-[#9CA3AF] text-base max-w-xl mx-auto leading-relaxed">
          Mereka pernah di posisi yang sama seperti kamu. Sekarang sudah di sisi lain.
        </p>
      </div>

      {/* Row 1 — scroll left */}
      <div className="flex gap-4 animate-marquee-left mb-4" style={{ width: 'max-content' }}>
        {[...ROW_1, ...ROW_1].map((g, i) => <GradCard key={i} g={g} />)}
      </div>

      {/* Row 2 — scroll right */}
      <div className="flex gap-4 animate-marquee-right" style={{ width: 'max-content' }}>
        {[...ROW_2, ...ROW_2].map((g, i) => <GradCard key={i} g={g} />)}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12 px-4">
        <p className="text-[#9CA3AF] text-sm">
          Namamu bisa ada di sini. <span className="text-[#2232dd] font-semibold">Mulai perjalananmu sekarang →</span>
        </p>
      </div>
    </section>
  )
}
