import Link from 'next/link'
import Image from 'next/image'
import { GraduationCap, Award, ArrowRight, BookOpen } from 'lucide-react'

interface Graduate {
  name: string
  prodi: string
  university: string
  milestone: 'Wisuda' | 'Sempro' | 'Sidang Akhir'
  color: string
  photo?: string
}

const BADGE: Record<Graduate['milestone'], { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  'Wisuda':      { label: 'Wisuda',       bg: 'bg-[#4DD9C0]',  text: 'text-[#1E1B4B]', icon: <GraduationCap size={10} /> },
  'Sempro':      { label: 'Sempro ACC',   bg: 'bg-white/90',   text: 'text-[#2232dd]', icon: <Award size={10} /> },
  'Sidang Akhir':{ label: 'Sidang Akhir', bg: 'bg-[#7C6FCD]',  text: 'text-white',     icon: <BookOpen size={10} /> },
}

const ROW_1: Graduate[] = [
  { name: 'Alin Permatasari', prodi: 'Akuntansi Syariah',       university: 'UIN Raden Intan Lampung', milestone: 'Sidang Akhir', color: 'from-[#2232dd] to-[#7C6FCD]', photo: '/graduates/Alin Permatasari-sidang akhir.jpeg' },
  { name: 'Amalia',           prodi: 'Psikologi',               university: 'UIN Raden Intan Lampung', milestone: 'Wisuda',       color: 'from-[#7C6FCD] to-[#4DD9C0]', photo: '/graduates/Amalia-wisuda.jpeg' },
  { name: 'Tiara Ayu',        prodi: 'Akuntansi Syariah',       university: 'UIN Raden Intan Lampung', milestone: 'Sidang Akhir', color: 'from-[#ea580c] to-[#f59e0b]', photo: '/graduates/Tiara Ayu-Sidang Akhir.jpeg' },
  { name: 'Ela Joevira',      prodi: 'Pendidikan Biologi',      university: 'UIN Raden Intan Lampung', milestone: 'Sempro',       color: 'from-[#16a34a] to-[#2232dd]', photo: '/graduates/Ela Joevira Pendidikan Biologi Sempro.jpeg' },
  { name: 'Diah Anggraini',   prodi: 'Pendidikan Biologi',      university: 'UIN Raden Intan Lampung', milestone: 'Sempro',       color: 'from-[#2232dd] to-[#7C6FCD]', photo: '/graduates/Diah Anggraini  Pendidikan Biologi Sempro.jpeg' },
  { name: 'Sarah Salsabila',  prodi: 'Akuntansi Syariah',       university: 'UIN Raden Intan Lampung', milestone: 'Sidang Akhir', color: 'from-[#16a34a] to-[#0f766e]', photo: '/graduates/Sarah Salsabilla-Sidang Akhir.jpeg' },
  { name: 'Sulthon',          prodi: 'Manajemen Pendidikan Islam', university: 'UIN Raden Intan Lampung', milestone: 'Sempro', color: 'from-[#7C6FCD] to-[#2232dd]', photo: '/graduates/Sultohon-Sempro.jpeg' },
  { name: 'M. Rendi Bachtiar', prodi: 'Pengelolaan Perkebunan Kopi', university: 'Politeknik Negeri Lampung', milestone: 'Sidang Akhir', color: 'from-[#ea580c] to-[#2232dd]', photo: '/graduates/M. Rendi Bachtiar S.Tr.P.jpeg' },
]

const ROW_2: Graduate[] = [
  { name: 'Fijira Pasya',      prodi: 'Pendidikan Olahraga',    university: 'Universitas Lampung',     milestone: 'Sidang Akhir', color: 'from-[#0f766e] to-[#4DD9C0]', photo: '/graduates/Fijira Pasya-sidang akhir.jpeg' },
  { name: 'Nadila Kurnia Sari',prodi: 'PGMI',                   university: 'UIN Raden Intan Lampung', milestone: 'Sidang Akhir', color: 'from-[#7C6FCD] to-[#ea580c]', photo: '/graduates/Nadila Kurnia Sari-sidang akhir.jpeg' },
  { name: 'Khazanah',          prodi: 'Manajemen Bisnis Syariah', university: 'UIN Raden Intan Lampung', milestone: 'Sidang Akhir', color: 'from-[#2232dd] to-[#4DD9C0]', photo: '/graduates/Khazanah-Sidang Akhir.jpeg' },
  { name: 'Ela Joevira',       prodi: 'Pendidikan Biologi',     university: 'UIN Raden Intan Lampung', milestone: 'Sidang Akhir', color: 'from-[#7C6FCD] to-[#0f766e]', photo: '/graduates/Ela Joevira Pendidikan Biologi Sidang Akhir.jpeg' },
  { name: 'Ela Joevira',       prodi: 'Pendidikan Biologi',     university: 'UIN Raden Intan Lampung', milestone: 'Wisuda',       color: 'from-[#4DD9C0] to-[#2232dd]', photo: '/graduates/Ela Joevira Pendidikan Biologi wisuda.jpeg' },
  { name: 'Alin Permatasari',  prodi: 'Akuntansi Syariah',      university: 'UIN Raden Intan Lampung', milestone: 'Sidang Akhir', color: 'from-[#ea580c] to-[#f59e0b]', photo: '/graduates/Alin Permatasari-sidang akhir.jpeg' },
  { name: 'Diah Anggraini',    prodi: 'Pendidikan Biologi',     university: 'UIN Raden Intan Lampung', milestone: 'Sempro',       color: 'from-[#0f766e] to-[#2232dd]', photo: '/graduates/Diah Anggraini  Pendidikan Biologi Sempro.jpeg' },
]

function GradCard({ g }: { g: Graduate }) {
  const badge = BADGE[g.milestone]
  const initials = g.name.split(' ').map(n => n[0]).join('')

  return (
    <div className="flex-shrink-0 w-44 rounded-2xl overflow-hidden shadow-md border border-gray-100">
      <div className={`h-52 bg-gradient-to-br ${g.color} flex items-center justify-center relative`}>
        {g.photo ? (
          <Image src={g.photo} alt={g.name} fill className="object-cover object-top" sizes="176px" />
        ) : (
          <span className="text-white/25 text-4xl font-bold select-none tracking-widest">{initials}</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>
            {badge.icon}{badge.label}
          </span>
        </div>
      </div>
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
          <GraduationCap size={13} /> 1.200+ Mahasiswa Berhasil
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-[#1E1B4B] mb-4 leading-tight">
          The Wall of <span className="gradient-text-navy">Graduates</span>
        </h2>
        <p className="text-[#9CA3AF] text-base max-w-xl mx-auto leading-relaxed">
          Mereka dulunya juga stuck, nunda, dan hopeless soal skripsi. Sekarang? Udah duluan foto wisuda.
        </p>
      </div>

      {/* Row 1 — scroll left */}
      <div className="flex gap-4 animate-marquee-left mb-4" style={{ width: 'max-content' }}>
        {[...ROW_1, ...ROW_1, ...ROW_1, ...ROW_1].map((g, i) => <GradCard key={i} g={g} />)}
      </div>

      {/* Row 2 — scroll right */}
      <div className="flex gap-4 animate-marquee-right" style={{ width: 'max-content' }}>
        {[...ROW_2, ...ROW_2, ...ROW_2, ...ROW_2].map((g, i) => <GradCard key={i} g={g} />)}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12 px-4">
        <p className="text-[#9CA3AF] text-sm mb-5">Namamu bisa ada di sini berikutnya.</p>
        <Link href="/#produk"
          className="group inline-flex items-center gap-2.5 bg-[#2232dd] hover:bg-[#1a28b8] text-white font-bold px-8 py-4 rounded-2xl text-sm sm:text-base transition-all duration-200 hover:shadow-xl hover:shadow-[#2232dd]/25 hover:-translate-y-0.5 cursor-pointer">
          Mulai Perjalananmu Sekarang
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
